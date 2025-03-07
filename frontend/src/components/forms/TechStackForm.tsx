import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const techStackSchema = z.object({
  frontend: z.string().min(1, "Frontend framework is required"),
  frontend_language: z.string().min(1, "Frontend language is required"),
  ui_library: z.string().optional(),
  backend: z.string().min(1, "Backend type is required"),
  backend_provider: z.string().optional(),
  database: z.string().min(1, "Database type is required"),
  database_provider: z.string().optional(),
  auth_provider: z.string().optional(),
  auth_methods: z.string().optional(),
});

type TechStackFormData = z.infer<typeof techStackSchema>;

interface TechStackFormProps {
  initialData?: Partial<TechStackFormData>;
  onSubmit: (data: TechStackFormData) => void;
  onBack: () => void;
}

const TechStackForm = ({
  initialData,
  onSubmit,
  onBack,
}: TechStackFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TechStackFormData>({
    resolver: zodResolver(techStackSchema),
    defaultValues: initialData || {
      frontend: "",
      frontend_language: "",
      ui_library: "",
      backend: "",
      backend_provider: "",
      database: "",
      database_provider: "",
      auth_provider: "",
      auth_methods: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Frontend Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Frontend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="frontend"
              className="block text-sm font-medium text-gray-700"
            >
              Framework
            </label>
            <select
              id="frontend"
              {...register("frontend")}
              className={`mt-1 input ${
                errors.frontend ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="">Select Framework</option>
              <option value="React">React</option>
              <option value="Next.js">Next.js</option>
              <option value="Vue">Vue</option>
              <option value="Angular">Angular</option>
              <option value="Svelte">Svelte</option>
            </select>
            {errors.frontend && (
              <p className="mt-1 text-sm text-red-600">
                {errors.frontend.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="frontend_language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <select
              id="frontend_language"
              {...register("frontend_language")}
              className={`mt-1 input ${
                errors.frontend_language
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <option value="">Select Language</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
            </select>
            {errors.frontend_language && (
              <p className="mt-1 text-sm text-red-600">
                {errors.frontend_language.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ui_library"
              className="block text-sm font-medium text-gray-700"
            >
              UI Library
            </label>
            <select
              id="ui_library"
              {...register("ui_library")}
              className="mt-1 input"
            >
              <option value="">Select UI Library</option>
              <option value="Tailwind CSS">Tailwind CSS</option>
              <option value="Material UI">Material UI</option>
              <option value="Chakra UI">Chakra UI</option>
              <option value="Bootstrap">Bootstrap</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backend Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="backend"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="backend"
              {...register("backend")}
              className={`mt-1 input ${
                errors.backend ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="">Select Backend Type</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Go">Go</option>
              <option value="Serverless">Serverless</option>
            </select>
            {errors.backend && (
              <p className="mt-1 text-sm text-red-600">
                {errors.backend.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="backend_provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider (if applicable)
            </label>
            <select
              id="backend_provider"
              {...register("backend_provider")}
              className="mt-1 input"
            >
              <option value="">Select Provider</option>
              <option value="AWS Lambda">AWS Lambda</option>
              <option value="Vercel">Vercel</option>
              <option value="Netlify">Netlify</option>
              <option value="Firebase">Firebase</option>
              <option value="Supabase">Supabase</option>
              <option value="Self-hosted">Self-hosted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Database</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="database"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="database"
              {...register("database")}
              className={`mt-1 input ${
                errors.database ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="">Select Database Type</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
              <option value="MongoDB">MongoDB</option>
              <option value="SQLite">SQLite</option>
              <option value="Firebase Firestore">Firebase Firestore</option>
              <option value="DynamoDB">DynamoDB</option>
            </select>
            {errors.database && (
              <p className="mt-1 text-sm text-red-600">
                {errors.database.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="database_provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider (if applicable)
            </label>
            <select
              id="database_provider"
              {...register("database_provider")}
              className="mt-1 input"
            >
              <option value="">Select Provider</option>
              <option value="AWS RDS">AWS RDS</option>
              <option value="Supabase">Supabase</option>
              <option value="MongoDB Atlas">MongoDB Atlas</option>
              <option value="Firebase">Firebase</option>
              <option value="Self-hosted">Self-hosted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Authentication
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="auth_provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider
            </label>
            <select
              id="auth_provider"
              {...register("auth_provider")}
              className="mt-1 input"
            >
              <option value="">Select Auth Provider</option>
              <option value="Custom">Custom</option>
              <option value="Firebase Auth">Firebase Auth</option>
              <option value="Auth0">Auth0</option>
              <option value="Supabase Auth">Supabase Auth</option>
              <option value="Clerk">Clerk</option>
              <option value="NextAuth">NextAuth</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="auth_methods"
              className="block text-sm font-medium text-gray-700"
            >
              Methods
            </label>
            <input
              id="auth_methods"
              type="text"
              placeholder="e.g. Email/Password, Google, GitHub"
              {...register("auth_methods")}
              className="mt-1 input"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Saving..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default TechStackForm;
