import React from "react";
import { Pages } from "../../types/templates";
import CollapsibleSection from "./CollapsibleSection";

interface PagesSectionProps {
  pages: Pages;
}

const PagesSection: React.FC<PagesSectionProps> = ({ pages }) => {
  return (
    <CollapsibleSection title="Application Pages">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Public Pages
          </h4>
          {pages.public && pages.public.length > 0 ? (
            <ul className="space-y-2">
              {pages.public.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No public pages</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Authenticated Pages
          </h4>
          {pages.authenticated && pages.authenticated.length > 0 ? (
            <ul className="space-y-2">
              {pages.authenticated.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No authenticated pages</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Admin Pages
          </h4>
          {pages.admin && pages.admin.length > 0 ? (
            <ul className="space-y-2">
              {pages.admin.map((page, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
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
