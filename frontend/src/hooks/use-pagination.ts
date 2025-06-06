import type { JobsGetJobsResponse } from "@/client";
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
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
    suspense: true,
  });

  return {
    data: result.data || [],
    isLoading: result.isLoading,
    isError: result.isError,
    hasMore: (result.data?.length ?? 0) === limit, // simple “hasMore” check
  };
}
