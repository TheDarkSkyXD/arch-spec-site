import React from 'react';
import { Pages } from '../../types/templates';
import CollapsibleSection from './CollapsibleSection';

interface PagesSectionProps {
  pages: Pages;
  isOpen: boolean;
  onToggle: () => void;
}

const PagesSection: React.FC<PagesSectionProps> = ({ pages, isOpen, onToggle }) => {
  return (
    <CollapsibleSection title="Application Pages" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Public Pages
          </h4>
          {pages.public && pages.public.length > 0 ? (
            <ul className="space-y-2">
              {pages.public.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="ml-1 text-xs text-slate-500">({page.path})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No public pages</p>
          )}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Authenticated Pages
          </h4>
          {pages.authenticated && pages.authenticated.length > 0 ? (
            <ul className="space-y-2">
              {pages.authenticated.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="ml-1 text-xs text-slate-500">({page.path})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No authenticated pages</p>
          )}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Admin Pages
          </h4>
          {pages.admin && pages.admin.length > 0 ? (
            <ul className="space-y-2">
              {pages.admin.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="ml-1 text-xs text-slate-500">({page.path})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No admin pages</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default PagesSection;
