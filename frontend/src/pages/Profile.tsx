import { useState, useEffect } from "react";
import { useAuth } from "../contexts";
import { userApi, UserUpdateData } from "../api/userApi";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import ProfileLayout from "../layouts/ProfileLayout";

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserUpdateData>({
    display_name: currentUser?.profile?.display_name || "",
    photo_url: currentUser?.profile?.photo_url || "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        // Attempt to reload the profile from API
        const profile = await userApi.getCurrentUser();

        // Update form data with fresh profile data
        setFormData({
          display_name: profile.display_name || "",
          photo_url: profile.photo_url || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(
          "Failed to load profile data. Using cached data if available."
        );

        // Fallback to cached data in currentUser if available
        if (currentUser?.profile) {
          setFormData({
            display_name: currentUser.profile.display_name || "",
            photo_url: currentUser.profile.photo_url || "",
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
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setError("Failed to update profile. Please try again later.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProfileLayout title="User Profile">
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </ProfileLayout>
    );
  }

  if (!currentUser) {
    return (
      <ProfileLayout title="User Profile">
        <div className="flex flex-col justify-center items-center h-full p-8">
          <div className="text-red-500 mb-4">
            You must be signed in to view your profile
          </div>
          <Button href="/login">Sign In</Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="User Profile">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <div className="md:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="display_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name || ""}
                    onChange={handleChange}
                    placeholder="Your display name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="photo_url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Profile Photo URL
                  </label>
                  <Input
                    id="photo_url"
                    name="photo_url"
                    value={formData.photo_url || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={currentUser.email || ""}
                    disabled
                    className="w-full bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
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
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                  {formData.photo_url ? (
                    <img
                      src={formData.photo_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Prevent infinite network requests by using an inline SVG
                        // instead of an external placeholder image
                        e.currentTarget.onerror = null; // Prevent further error events
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3e%3crect fill="%23CCCCCC" width="150" height="150"/%3e%3ctext fill="%23666666" font-family="sans-serif" font-size="14" dy=".3em" text-anchor="middle" x="75" y="75"%3eUser%3c/text%3e%3c/svg%3e';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-semibold">
                  {formData.display_name || "User"}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {currentUser.email}
                </p>

                <div className="w-full pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <p className="text-gray-500">Account created:</p>
                    <p className="font-medium">
                      {currentUser.profile?.created_at
                        ? new Date(
                            currentUser.profile.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="text-sm mt-2">
                    <p className="text-gray-500">Last login:</p>
                    <p className="font-medium">
                      {currentUser.profile?.last_login
                        ? new Date(
                            currentUser.profile.last_login
                          ).toLocaleDateString()
                        : "N/A"}
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
