import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { userApi, UserUpdateData } from '../api/userApi';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import ProfileLayout from '../layouts/ProfileLayout';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserUpdateData>({
    display_name: currentUser?.profile?.display_name || '',
    photo_url: currentUser?.profile?.photo_url || '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        // Attempt to reload the profile from API
        const profile = await userApi.getCurrentUserProfile();

        // Update form data with fresh profile data
        setFormData({
          display_name: profile.display_name || '',
          photo_url: profile.photo_url || '',
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Using cached data if available.');

        // Fallback to cached data in currentUser if available
        if (currentUser?.profile) {
          setFormData({
            display_name: currentUser.profile.display_name || '',
            photo_url: currentUser.profile.photo_url || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      await userApi.updateUserProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      setError('Failed to update profile. Please try again later.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProfileLayout title="User Profile">
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ProfileLayout>
    );
  }

  if (!currentUser) {
    return (
      <ProfileLayout title="User Profile">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 text-red-500">You must be signed in to view your profile</div>
          <Button href="/login">Sign In</Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="User Profile">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">User Profile</h1>

        {error && (
          <div className="mb-6 rounded-md border border-red-100 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Information Card */}
          <div className="md:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="display_name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Display Name
                  </label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name || ''}
                    onChange={handleChange}
                    placeholder="Your display name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="photo_url"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Profile Photo URL
                  </label>
                  <Input
                    id="photo_url"
                    name="photo_url"
                    value={formData.photo_url || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={currentUser.email || ''}
                    disabled
                    className="w-full bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={updating}>
                    {updating ? <Spinner size="sm" className="mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Profile Preview Card */}
          <div>
            <Card>
              <div className="flex flex-col items-center">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                  {formData.photo_url ? (
                    <img
                      src={formData.photo_url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Prevent infinite network requests by using an inline SVG
                        // instead of an external placeholder image
                        e.currentTarget.onerror = null; // Prevent further error events
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3e%3crect fill="%23CCCCCC" width="150" height="150"/%3e%3ctext fill="%23666666" font-family="sans-serif" font-size="14" dy=".3em" text-anchor="middle" x="75" y="75"%3eUser%3c/text%3e%3c/svg%3e';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-semibold">{formData.display_name || 'User'}</h2>
                <p className="mb-4 text-sm text-gray-500">{currentUser.email}</p>

                <div className="w-full border-t border-gray-200 pt-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Account created:</p>
                    <p className="font-medium">
                      {currentUser.profile?.created_at
                        ? new Date(currentUser.profile.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="mt-2 text-sm">
                    <p className="text-gray-500">Last login:</p>
                    <p className="font-medium">
                      {currentUser.profile?.last_login
                        ? new Date(currentUser.profile.last_login).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
