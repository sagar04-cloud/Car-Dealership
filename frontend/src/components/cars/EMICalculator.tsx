import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

interface EMICalculatorProps {
  carPrice: number;
}

const EMICalculator: React.FC<EMICalculatorProps> = ({ carPrice }) => {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [loanAmount, setLoanAmount] = useState(carPrice - Math.round(carPrice * 0.2));
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEMI = React.useCallback(() => {
    const principal = carPrice - downPayment;
    setLoanAmount(principal);
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (principal > 0 && interestRate > 0) {
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPay = emiValue * numberOfPayments;
      const totalInt = totalPay - principal;
      
      setEmi(Math.round(emiValue));
      setTotalInterest(Math.round(totalInt));
      setTotalPayment(Math.round(totalPay));
    }
  }, [carPrice, downPayment, interestRate, loanTerm]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">EMI Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Car Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formatCurrency(carPrice)}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Down Payment ({Math.round((downPayment / carPrice) * 100)}%)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <input
              type="range"
              min="0"
              max={carPrice}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formatCurrency(loanAmount)}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interest Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loan Term (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                    <option key={year} value={year}>
                      {year} Year{year > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Breakdown</h3>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold text-accent">{formatCurrency(emi)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalInterest)}</p>
              </div>

              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Payment</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalPayment)}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Payment Breakdown</p>
              <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-4">
                <div
                  className="bg-accent h-4 rounded-full"
                  style={{
                    width: `${(loanAmount / (loanAmount + totalInterest)) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Principal: {formatCurrency(loanAmount)}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  Interest: {formatCurrency(totalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
