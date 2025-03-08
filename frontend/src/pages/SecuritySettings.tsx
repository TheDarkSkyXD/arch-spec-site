import { useState } from 'react';
import { useAuth } from '../contexts';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import ProfileLayout from '../layouts/ProfileLayout';

const SecuritySettings = () => {
  const { currentUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again before changing your password');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileLayout title="Security Settings">
      <div className="grid grid-cols-1 gap-6">
        {/* Password Change Card */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Enter your current password"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Enter new password"
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" className="mr-2" /> : null}
                Update Password
              </Button>
            </div>
          </form>
        </Card>
        
        {/* Account Security Card */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email Address</h3>
              <p className="text-sm text-gray-500 mb-2">Your account is linked to this email address</p>
              <div className="flex items-center">
                <span className="font-medium">{currentUser?.email}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Verified
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mb-2">Add an extra layer of security to your account</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="text-sm text-gray-500 mb-2">View your recent login activity</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
};

export default SecuritySettings;
