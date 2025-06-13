import type { JobRead, JobsGetJobsResponse } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";
import { useQuery } from "@tanstack/react-query";

export function useJobsQuery() {
  const { page, limit, q } = Route.useSearch();
  const queryKey = ["jobs", { page, limit, q }];

  const result = useQuery<JobsGetJobsResponse>({
    queryKey,
    queryFn: async () => {
      const response = await JobsService.getJobs({
        query: { page, limit, search: q },
        throwOnError: true,
      });
      return response.data as unknown as JobRead[];
    },
    // keepPreviousData: true,
    // staleTime: 1000 * 60 * 2,
    suspense: true,
  });

  return {
    data: result.data || [],
    isLoading: result.isLoading,
    isError: result.isError,
    hasMore: ((result.data as JobsGetJobsResponse) || []).length === limit, // simple “hasMore” check
  };
}
