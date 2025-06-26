import type { JobRead, JobsGetJobsResponse } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";
import { useQuery } from "@tanstack/react-query";

export function useJobsQuery(advanced: boolean = false) {
  const { page, limit, q, title, company, location, description } =
    Route.useSearch();

  const queryKey = advanced
    ? ["advancedJobs", { page, limit, title, company, location, description }]
    : ["jobs", { page, limit, q }];

  const result = useQuery<JobsGetJobsResponse>({
    queryKey,
    queryFn: async () => {
      // Basic Search
      if (!advanced) {
        const response = await JobsService.getJobs({
          query: { page, limit, search: q },
          throwOnError: true,
        });
        return response.data as unknown as JobRead[];
      }
      // Advanced Search
      else {
        const response = await JobsService.getJobsAdvanced({
          query: { page, limit, title, company, location, description },
          throwOnError: true,
        });
        return response.data as unknown as JobRead[];
      }
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
