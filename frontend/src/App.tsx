import Router from "./router";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";
import { AuthProvider } from "./contexts/AuthContextProvider";
import { ThemeProvider } from "./contexts/ThemeContextProvider";
import { ToastProvider } from "./contexts/ToastContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ToastContainer from "./components/ui/ToastContainer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SubscriptionProvider>
              <Router />
              <ToastContainer />
              {import.meta.env.MODE !== "production" && (
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
