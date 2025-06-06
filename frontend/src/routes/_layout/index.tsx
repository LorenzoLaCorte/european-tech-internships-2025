// routes/_layout/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  beforeLoad: async () => {
    // As soon as someone hits "/", throw a redirect to "/jobs"
    throw redirect({ to: "/jobs" });
  },
});
