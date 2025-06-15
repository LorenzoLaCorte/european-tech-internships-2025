import type { JobRead } from "@/client";
import { Route } from "@/routes/advanced";
import { useQuery } from "@tanstack/react-query";

export function useAdvancedJobsQuery() {
  const { page, limit, title, company, location, description } =
    Route.useSearch();
  const queryKey = [
    "advancedJobs",
    { page, limit, title, company, location, description },
  ];

  const result = useQuery<JobRead[]>({
    queryKey,
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      title.forEach((t) => params.append("title", t));
      company.forEach((t) => params.append("company", t));
      location.forEach((t) => params.append("location", t));
      description.forEach((t) => params.append("description", t));

      const res = await fetch(`/api/jobs/advanced?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return (await res.json()) as JobRead[];
    },
    suspense: true,
  });

  return {
    data: result.data || [],
    isLoading: result.isLoading,
    isError: result.isError,
    hasMore: (result.data || []).length === limit,
  };
}
