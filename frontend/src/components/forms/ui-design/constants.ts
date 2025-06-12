import { UIDesign } from '../../../types/templates';

// Define initial UI design state
export const initialDesign: UIDesign = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#f59e0b',
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    surface: '#ffffff',
    border: '#e5e7eb',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Inter, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    fontWeight: 400,
    headingSizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
    },
  },
  spacing: {
    unit: '4px',
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  },
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
    xl: '12px',
    pill: '9999px',
  },
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  layout: {
    containerWidth: '1280px',
    responsive: true,
    sidebarWidth: '240px',
    topbarHeight: '64px',
    gridColumns: 12,
    gutterWidth: '16px',
  },
  components: {
    buttonStyle: 'rounded', // rounded, square, pill
    inputStyle: 'outline', // outline, filled, underline
    cardStyle: 'shadow', // shadow, outline, flat
    tableStyle: 'bordered', // bordered, striped, minimal
    navStyle: 'pills', // pills, tabs, links
  },
  darkMode: {
    enabled: true,
    colors: {
      background: '#1f2937',
      textPrimary: '#f9fafb',
      textSecondary: '#e5e7eb',
      surface: '#374151',
      border: '#4b5563',
    },
  },
  animations: {
    transitionDuration: '150ms',
    transitionTiming: 'ease-in-out',
    hoverScale: 1.05,
    enableAnimations: true,
  },
};

// Font options
export const fontOptions = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Montserrat, sans-serif',
  'Poppins, sans-serif',
  'Lato, sans-serif',
  'Source Sans Pro, sans-serif',
  'Raleway, sans-serif',
  'Nunito, sans-serif',
  'System UI, sans-serif',
];

// Component style options
export const buttonStyles = ['rounded', 'square', 'pill'];
export const inputStyles = ['outline', 'filled', 'underline'];
export const cardStyles = ['shadow', 'outline', 'flat'];
export const tableStyles = ['bordered', 'striped', 'minimal'];
export const navStyles = ['pills', 'tabs', 'links']; 