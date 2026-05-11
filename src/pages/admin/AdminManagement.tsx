import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, Key, Trash2, Shield, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { ref, get, set, remove } from 'firebase/database';
import { auth, realtimeDb } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: any;
}

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Admin form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Change My Password form
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showCurPwd, setShowCurPwd] = useState(false);
  const [showChgPwd, setShowChgPwd] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const usersRef = ref(realtimeDb, 'users');
      const snap = await get(usersRef);
      const list: AdminUser[] = [];
      if (snap.exists()) {
        snap.forEach(childSnap => {
          const data = childSnap.val();
          if (data.role === 'admin') {
            list.push({ id: childSnap.key as string, ...data } as AdminUser);
          }
        });
      }
      setAdmins(list);
    } catch {
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  // ─── Add Admin ────────────────────────────────────────────────
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setAddLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, newAdmin.email, newAdmin.password);
      const uid = credential.user.uid;
      await set(ref(realtimeDb, `users/${uid}`), {
        id: uid,
        email: newAdmin.email,
        name: newAdmin.name,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      toast.success(`Admin "${newAdmin.name}" added successfully!`);
      setNewAdmin({ name: '', email: '', password: '' });
      setShowAddForm(false);
      fetchAdmins();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') toast.error('An account with this email already exists.');
      else toast.error(err.message || 'Failed to create admin');
    } finally {
      setAddLoading(false);
    }
  };

  // ─── Change Password ──────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPwd !== pwdForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwdLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        // Local admin fallback — can't change Firebase password
        toast.error('Password change is only available for Firebase-authenticated accounts.');
        return;
      }
      // Re-authenticate first
      const cred = EmailAuthProvider.credential(currentUser.email, pwdForm.current);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, pwdForm.newPwd);
      toast.success('Password changed successfully!');
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      setShowPwdForm(false);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect');
      } else {
        toast.error(err.message || 'Failed to change password');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  // ─── Remove admin role (demote to user) ──────────────────────
  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (admin.email === user?.email) {
      toast.error("You can't remove yourself as admin");
      return;
    }
    if (!window.confirm(`Remove admin privileges from ${admin.name || admin.email}?`)) return;
    try {
      await remove(ref(realtimeDb, `users/${admin.id}`));
      toast.success('Admin removed');
      fetchAdmins();
    } catch {
      toast.error('Failed to remove admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="h-6 w-6 text-accent" />
            <span>Admin Management</span>
          </h1>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => { setShowAddForm(true); setShowPwdForm(false); }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Add New Admin</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create a new admin account</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setShowPwdForm(true); setShowAddForm(false); }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Change My Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your admin password</p>
              </div>
            </div>
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              <span>Add New Admin</span>
            </h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="input-field"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="input-field pr-10"
                    placeholder="Min 6 characters"
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showNewPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading} className="btn-primary flex items-center space-x-2 px-4 py-2">
                  {addLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : <><UserPlus className="h-4 w-4" /><span>Create Admin</span></>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Form */}
        {showPwdForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Key className="h-5 w-5 text-purple-500" />
              <span>Change My Password</span>
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showCurPwd ? 'text' : 'password'} required value={pwdForm.current} onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })} className="input-field pr-10" placeholder="Your current password" />
                  <button type="button" onClick={() => setShowCurPwd(!showCurPwd)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showCurPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input type={showChgPwd ? 'text' : 'password'} required value={pwdForm.newPwd} onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })} className="input-field pr-10" placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowChgPwd(!showChgPwd)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showChgPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input type="password" required value={pwdForm.confirm} onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} className="input-field" placeholder="Repeat new password" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowPwdForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={pwdLoading} className="btn-primary flex items-center space-x-2 px-4 py-2">
                  {pwdLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : <><Key className="h-4 w-4" /><span>Update Password</span></>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admin List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Admins</h2>
            <button onClick={fetchAdmins} className="text-gray-400 hover:text-accent transition-colors" title="Refresh">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            </div>
          ) : admins.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No admin accounts found in Firestore.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">The local admin (admin@ssmotors.com) is built-in.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <div key={admin.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{admin.name || '—'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">Admin</span>
                    {admin.email === user?.email ? (
                      <span className="text-xs text-gray-400">(You)</span>
                    ) : (
                      <button
                        onClick={() => handleRemoveAdmin(admin)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove admin"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Built-in local admin note */}
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Built-in admin: admin@ssmotors.com (cannot be removed from here)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
