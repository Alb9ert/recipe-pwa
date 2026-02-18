import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import AppRoutes from "./components/routes/AppRoutes";
import { RecipeProvider } from "./context/RecipeContext";
import { ShoppingListProvider } from "./context/ShoppingListContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RecipeProvider>
          <ShoppingListProvider>
            <AppRoutes />
          </ShoppingListProvider>
        </RecipeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(
    (registration) => {
      console.log("Service Worker registered:", registration);
    },
    (err) => {
      console.log("Service Worker registration failed:", err);
    },
  );
}
