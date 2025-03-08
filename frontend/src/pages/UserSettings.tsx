import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { userApi } from '../api/userApi';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Toggle from '../components/ui/Toggle';
import ProfileLayout from '../layouts/ProfileLayout';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  [key: string]: any;
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
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser?.profile) return;
      
      setLoading(true);
      try {
        // Merge default settings with user settings from profile
        const userSettings = currentUser.profile.settings as Record<string, any>;
        setSettings({
          ...defaultSettings,
          ...userSettings,
        });
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleToggleChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await userApi.updateUserSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileLayout title="User Settings">
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="User Settings">
      <div className="grid grid-cols-1 gap-6">
        {/* Appearance Settings */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="flex space-x-4">
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
        <Card>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications in the app</p>
              </div>
              <Toggle 
                enabled={settings.notifications} 
                onChange={(value) => handleToggleChange('notifications', value)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Updates</h3>
                <p className="text-sm text-gray-500">Receive email notifications about account activity</p>
              </div>
              <Toggle 
                enabled={settings.emailUpdates} 
                onChange={(value) => handleToggleChange('emailUpdates', value)} 
              />
            </div>
          </div>
        </Card>
        
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
      className={`px-4 py-2 rounded-md ${active
        ? 'bg-blue-100 text-blue-700 border border-blue-300'
        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

export default UserSettingsPage;
