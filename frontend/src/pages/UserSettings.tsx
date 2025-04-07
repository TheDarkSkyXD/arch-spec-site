import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { userApi } from '../api/userApi';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import ProfileLayout from '../layouts/ProfileLayout';

type ColorScheme = 'light' | 'dark' | 'system';

interface UserSettings {
  theme: ColorScheme;
  notifications: boolean;
  emailUpdates: boolean;
  [key: string]: unknown;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  emailUpdates: false,
};

const UserSettingsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Try to load settings from API directly
        const profile = await userApi.getCurrentUserProfile();

        // Merge default settings with user settings from profile
        const userSettings = profile.settings as Record<string, unknown>;
        setSettings({
          ...defaultSettings,
          ...userSettings,
        });

        // Apply theme setting to the document
        applyTheme((userSettings?.theme as ColorScheme) || defaultSettings.theme);
      } catch (error) {
        console.error('Error loading settings:', error);
        setError('Failed to load settings. Using default settings.');

        // Fallback to cached settings if available
        if (currentUser?.profile?.settings) {
          setSettings({
            ...defaultSettings,
            ...currentUser.profile.settings,
          });

          // Apply theme setting to the document
          applyTheme((currentUser.profile.settings?.theme as ColorScheme) || defaultSettings.theme);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    // Apply selected theme
    if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));

    // Apply theme immediately for better UX
    applyTheme(theme);
  };

  // const handleToggleChange = (setting: string, value: boolean) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     [setting]: value,
  //   }));
  // };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      await userApi.updateUserSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      setError('Failed to save settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileLayout title="User Settings">
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ProfileLayout>
    );
  }

  if (!currentUser) {
    return (
      <ProfileLayout title="User Settings">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 text-red-500">You must be signed in to view settings</div>
          <Button href="/login">Sign In</Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="User Settings">
      <div className="grid grid-cols-1 gap-6">
        {error && (
          <div className="rounded-md border border-red-100 bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {/* Appearance Settings */}
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Appearance</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Theme</label>
              <div className="flex flex-wrap gap-4">
                <ThemeButton
                  active={settings.theme === 'light'}
                  onClick={() => handleThemeChange('light')}
                  label="Light"
                />
                <ThemeButton
                  active={settings.theme === 'dark'}
                  onClick={() => handleThemeChange('dark')}
                  label="Dark"
                />
                <ThemeButton
                  active={settings.theme === 'system'}
                  onClick={() => handleThemeChange('system')}
                  label="System"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        {/* <Card>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive notifications in the app
                </p>
              </div>
              <Toggle
                enabled={settings.notifications}
                onChange={(value) => handleToggleChange("notifications", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Updates</h3>
                <p className="text-sm text-gray-500">
                  Receive email notifications about account activity
                </p>
              </div>
              <Toggle
                enabled={settings.emailUpdates}
                onChange={(value) => handleToggleChange("emailUpdates", value)}
              />
            </div>
          </div>
        </Card> */}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? <Spinner size="sm" className="mr-2" /> : null}
            Save Settings
          </Button>
        </div>
      </div>
    </ProfileLayout>
  );
};

// Theme selection button component
interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const ThemeButton = ({ active, onClick, label }: ThemeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 ${
        active
          ? 'border border-blue-300 bg-blue-100 text-blue-700'
          : 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

export default UserSettingsPage;
