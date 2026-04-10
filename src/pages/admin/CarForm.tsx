import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Car } from '../../types';
import CarService from '../../services/carService';

const emptyForm: Omit<Car, 'id' | 'createdAt' | 'updatedAt'> = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  images: [''],
  fuelType: 'Petrol',
  transmission: 'Manual',
  mileage: 0,
  description: '',
  features: [''],
  status: 'available',
  featured: false,
  color: '',
  engineCapacity: '',
  seatingCapacity: 5,
};

type ImageEntry = { value: string };

const CarForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([{ value: '' }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      CarService.getCar(id).then((car) => {
        if (car) {
          const { id: _id, createdAt, updatedAt, ...rest } = car as Car;
          setForm({
            ...rest,
            features: rest.features?.length ? rest.features : [''],
          });
          // Populate image entries from existing URLs
          const entries: ImageEntry[] = (rest.images?.length ? rest.images : ['']).map((url) => ({
            value: url,
          }));
          setImageEntries(entries);
        } else {
          toast.error('Car not found');
          navigate('/admin/cars');
        }
      }).finally(() => setFetching(false));
    }
  }, [id, isEditing, navigate]);

  const set = (field: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Image handlers ───────────────────────────────────────────
  const addImageEntry = () =>
    setImageEntries((prev) => [...prev, { value: '' }]);

  const removeImageEntry = (index: number) =>
    setImageEntries((prev) => prev.filter((_, i) => i !== index));

  const setUrlEntry = (index: number, value: string) =>
    setImageEntries((prev) =>
      prev.map((e, i) => (i === index ? { value } : e))
    );

  // ─── Features ─────────────────────────────────────────────────
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...form.features];
    updated[index] = value;
    set('features', updated);
  };
  const addFeature = () => set('features', [...form.features, '']);
  const removeFeature = (index: number) =>
    set('features', form.features.filter((_, i) => i !== index));

  // ─── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) {
      toast.error('Brand and model are required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setLoading(true);
    setPermissionError(false);
    
    try {
      // Resolve all image URLs
      const resolvedImages: string[] = [];
      for (let i = 0; i < imageEntries.length; i++) {
        const entry = imageEntries[i];
        if (entry.value.trim()) {
           resolvedImages.push(entry.value.trim());
        }
      }

      // Use a placeholder if no images provided
      if (resolvedImages.length === 0) {
        resolvedImages.push('https://placehold.co/640x480?text=No+Image');
      }

      const cleanedData = {
        ...form,
        images: resolvedImages,
        features: form.features.filter((f) => f.trim() !== ''),
        price: Number(form.price),
        year: Number(form.year),
        mileage: Number(form.mileage),
        seatingCapacity: Number(form.seatingCapacity),
      };

      console.log('Saving car data:', cleanedData);

      if (isEditing && id) {
        await CarService.updateCar(id, cleanedData);
        toast.success('Car updated successfully!');
      } else {
        await CarService.createCar(cleanedData);
        toast.success('Car added successfully!');
      }
      navigate('/admin/cars');
    } catch (error: any) {
      console.error('Car save error:', error);
      const msg = error?.message || '';
      if (msg.includes('permission') || msg.includes('PERMISSION_DENIED') || error?.code === 'permission-denied') {
        setPermissionError(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error('Error: ' + (msg || 'Failed to save car'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/cars')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cars
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Car' : 'Add New Car'}
          </h1>
        </div>

        {permissionError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg shadow-sm">
            <h3 className="text-red-800 font-bold text-lg mb-2 flex items-center">
              <X className="h-5 w-5 mr-2" />
              Database Permission Denied!
            </h3>
            <p className="text-red-700 mb-4">
              Firebase is blocking you from saving the car details. You must update your <strong>Realtime Database</strong> Rules to allow writes.
            </p>
            <div className="bg-white p-4 rounded border border-red-200 text-sm font-mono text-gray-800 overflow-x-auto">
              <div>{'{'}</div>
              <div className="pl-4">"rules": {'{'}</div>
              <div className="pl-8 text-blue-600 font-bold">".read": true,</div>
              <div className="pl-8 text-blue-600 font-bold">".write": true</div>
              <div className="pl-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
            <p className="text-sm text-red-600 mt-4 font-semibold">
              Go to Firebase Console → Realtime Database → Rules → Paste the code above → Click Publish.
            </p>
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand *</label>
                <input type="text" required value={form.brand} onChange={(e) => set('brand', e.target.value)} className="input-field" placeholder="e.g. Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model *</label>
                <input type="text" required value={form.model} onChange={(e) => set('model', e.target.value)} className="input-field" placeholder="e.g. Camry" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
                <input type="number" required min={1990} max={2030} value={form.year} onChange={(e) => set('year', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                <input type="number" required min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" placeholder="e.g. 25000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <input type="text" value={form.color} onChange={(e) => set('color', e.target.value)} className="input-field" placeholder="e.g. Pearl White" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mileage (km)</label>
                <input type="number" min={0} value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className="input-field" placeholder="e.g. 15000" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field" placeholder="Describe the car..." />
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Type</label>
                <select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)} className="input-field">
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transmission</label>
                <select value={form.transmission} onChange={(e) => set('transmission', e.target.value)} className="input-field">
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Engine Capacity</label>
                <input type="text" value={form.engineCapacity} onChange={(e) => set('engineCapacity', e.target.value)} className="input-field" placeholder="e.g. 2.5L" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seating Capacity</label>
                <input type="number" min={1} max={15} value={form.seatingCapacity} onChange={(e) => set('seatingCapacity', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-field">
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 text-accent rounded" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Featured</label>
              </div>
            </div>
          </div>

          {/* Images — Upload or URL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Images</h2>
              <button type="button" onClick={addImageEntry} className="btn-primary text-sm flex items-center space-x-1 py-1 px-3">
                <Plus className="h-4 w-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="space-y-4">
              {imageEntries.map((entry, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    {entry.value && (
                      <img src={entry.value} alt="preview" className="h-14 w-20 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    )}
                    <input
                      type="text"
                      value={entry.value}
                      onChange={(e) => setUrlEntry(idx, e.target.value)}
                      className="input-field flex-1"
                      placeholder="https://example.com/car-image.jpg"
                    />
                    {imageEntries.length > 1 && (
                      <button type="button" onClick={() => removeImageEntry(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h2>
              <button type="button" onClick={addFeature} className="btn-primary text-sm flex items-center space-x-1 py-1 px-3">
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input type="text" value={feat} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="input-field flex-1" placeholder="e.g. Sunroof, Leather Seats..." />
                  {form.features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pb-8">
            <button type="button" onClick={() => navigate('/admin/cars')} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 px-6 py-3">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>{isEditing ? 'Update Car' : 'Add Car'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
