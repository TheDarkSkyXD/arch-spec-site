import * as React from "react";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className = "",
  children,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (tabValue: string) => {
    if (onValueChange) {
      onValueChange(tabValue);
    } else {
      setActiveTab(tabValue);
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab: value !== undefined ? value : activeTab,
            onTabChange: handleTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({
  className = "",
  children,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className={`flex space-x-1 border-b border-slate-200 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            onTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className = "",
  children,
  activeTab,
  onTabChange,
}) => {
  const isActive = activeTab === value;

  const handleClick = () => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
        isActive
          ? "border-primary-600 text-primary-600"
          : "border-transparent text-slate-600 hover:text-primary-500 hover:border-primary-300 dark:hover:text-primary-400 dark:hover:border-primary-400"
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = "",
  children,
  activeTab,
}) => {
  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};
