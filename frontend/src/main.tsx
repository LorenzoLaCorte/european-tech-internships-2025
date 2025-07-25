import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { client } from "@/client/client.gen";
import { Toaster } from "@/components/ui/toaster";
import { routeTree } from "@/routeTree.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:6001",
});

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
);
