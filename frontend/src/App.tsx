import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';
import { queryClient } from './lib/query-client';
import Router from './router';

import ToastContainer from './components/ui/ToastContainer';
import { AuthProvider, SubscriptionProvider, ThemeProvider, ToastProvider } from './contexts';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SubscriptionProvider>
              <Router />
              <ToastContainer />
              {import.meta.env.MODE !== 'production' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </SubscriptionProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
