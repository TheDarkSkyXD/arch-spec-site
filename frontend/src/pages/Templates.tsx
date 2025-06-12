import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Package, Grid3X3, List, Loader2, Eye } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useTemplates } from '../hooks/useDataQueries';
import { ProjectTemplate } from '../types/templates';
import TemplateDetailsModal from '../components/modals/TemplateDetailsModal';

const Templates = () => {
  const navigate = useNavigate();
  const { data: templates = [], isLoading, error: queryError } = useTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set error if query fails
  if (queryError && !error) {
    console.error('Failed to fetch templates:', queryError);
    setError('Failed to load templates. Please try again later.');
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.tags &&
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/new-project?template=${templateId}`);
  };

  const handleViewDetails = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <MainLayout>
      <div className="h-full w-full">
        {/* Header section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
              Templates
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Choose a template to start your architecture project
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'border border-slate-200 bg-white text-slate-400 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'border border-slate-200 bg-white text-slate-400 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Search and filters bar */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Loader2 size={32} className="animate-spin text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Loading templates
            </h3>
            <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">
              Please wait while we fetch available templates
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Package size={24} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Error loading templates
            </h3>
            <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">{error}</p>
          </div>
        )}

        {/* Templates grid */}
        {!isLoading && !error && filteredTemplates.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredTemplates.map((template) =>
              viewMode === 'grid' ? (
                <div
                  key={template.name}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative flex h-32 items-center justify-center bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30">
                    <div className="rounded-lg bg-white p-3 dark:bg-slate-800">
                      <Package size={24} className="text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col p-4">
                    <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {template.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {template.description}
                    </p>
                    {/* Development mode debugging info - remove in production */}
                    {import.meta.env.DEV && (
                      <div className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                        <p>ID: {template.id || 'Not set'}</p>
                        <p>Version: {template.version}</p>
                      </div>
                    )}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {template.tags &&
                        template.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleTemplateSelect(template.id || template.version)}
                        className="flex-1 rounded-lg bg-primary-600 py-2 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800"
                      >
                        Use This Template
                      </button>
                      <button
                        onClick={() => handleViewDetails(template)}
                        className="group relative rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          Preview
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={template.name}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <Package size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {template.name}
                        </h3>
                      </div>
                      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                        {template.description}
                      </p>
                      {/* Development mode debugging info - remove in production */}
                      {import.meta.env.DEV && (
                        <div className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                          <p>ID: {template.id || 'Not set'}</p>
                          <p>Version: {template.version}</p>
                        </div>
                      )}
                      <div className="mb-3 flex flex-wrap gap-1">
                        {template.tags &&
                          template.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleTemplateSelect(template.id || template.version)}
                          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800"
                        >
                          Use This Template
                        </button>
                        <button
                          onClick={() => handleViewDetails(template)}
                          className="group relative rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          aria-label="View details"
                        >
                          <Eye size={18} />
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Preview
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : !isLoading && !error ? (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Package size={24} className="text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              {searchQuery ? `No templates matching "${searchQuery}"` : 'No templates available'}
            </h3>
            <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try using different search terms'
                : 'Check back later for new templates'}
            </p>
          </div>
        ) : null}

        {/* Template Details Modal */}
        {selectedTemplate && (
          <TemplateDetailsModal
            template={selectedTemplate}
            isOpen={isModalOpen}
            onClose={closeModal}
            onUseTemplate={handleTemplateSelect}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Templates;
