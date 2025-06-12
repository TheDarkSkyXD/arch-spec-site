import { useState } from 'react';
import { useAuth } from '../contexts';
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError(null);

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
        setFormErrors({
          ...formErrors,
          currentPassword: 'Current password is incorrect',
        });
      } else if (error.code === 'auth/requires-recent-login') {
        setGeneralError('Session expired. Please sign in again before changing your password');
        toast.error('Please sign in again before changing your password');
      } else if (error.code === 'auth/too-many-requests') {
        setGeneralError('Too many failed attempts. Please try again later');
        toast.error('Too many failed attempts. Please try again later');
      } else {
        setGeneralError('Failed to update password. Please try again later');
        toast.error('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <ProfileLayout title="Security Settings">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 text-red-500">You must be signed in to manage security settings</div>
          <Button href="/login">Sign In</Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Security Settings">
      <div className="grid grid-cols-1 gap-6">
        {generalError && (
          <div className="rounded-md border border-red-100 bg-red-50 p-4 text-red-600">
            {generalError}
          </div>
        )}

        {/* Password Change Card */}
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={`w-full ${formErrors.currentPassword ? 'border-red-300' : ''}`}
                placeholder="Enter your current password"
              />
              {formErrors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">{formErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={`w-full ${formErrors.newPassword ? 'border-red-300' : ''}`}
                placeholder="Enter new password"
                minLength={8}
              />
              {formErrors.newPassword ? (
                <p className="mt-1 text-xs text-red-500">{formErrors.newPassword}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include uppercase letters and numbers
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full ${formErrors.confirmPassword ? 'border-red-300' : ''}`}
                placeholder="Confirm new password"
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
              )}
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
          <h2 className="mb-4 text-xl font-semibold">Account Security</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email Address</h3>
              <p className="mb-2 text-sm text-gray-500">
                Your account is linked to this email address
              </p>
              <div className="flex items-center">
                <span className="font-medium">{currentUser?.email}</span>
                <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                  Verified
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="mb-2 text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>

            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="mb-2 text-sm text-gray-500">View your recent login activity</p>
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
