import { UseFormRegister } from "react-hook-form";

interface AuthenticationSectionProps {
  register: UseFormRegister<any>;
  backend: string | undefined;
  authOptions: string[];
}

const AuthenticationSection = ({
  register,
  backend,
  authOptions,
}: AuthenticationSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Authentication
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="auth_provider"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Provider
          </label>
          <select
            id="auth_provider"
            {...register("auth_provider")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            disabled={!backend || authOptions.length === 0}
          >
            <option value="">Select Auth Provider</option>
            {authOptions.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="auth_methods"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Methods
          </label>
          <select
            id="auth_methods"
            {...register("auth_methods")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Auth Methods</option>
            <option value="Email/Password">Email/Password</option>
            <option value="Social">Social Logins</option>
            <option value="Email/Password + Social">
              Email/Password + Social
            </option>
            <option value="SSO">SSO</option>
            <option value="Multi-factor">Multi-factor Authentication</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSection;