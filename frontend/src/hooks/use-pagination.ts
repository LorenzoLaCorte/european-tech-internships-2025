import type { JobRead, JobsGetJobsResponse } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";
import { useQuery } from "@tanstack/react-query";

/** Single hook for basic & advanced job queries – now with keepPreviousData + sensible staleTime */
export function useJobsQuery(isAdvanced: boolean = false) {
  const { page, limit, q, title, company, location, description } =
    Route.useSearch();

  const queryKey = isAdvanced
    ? [
        "jobs",
        "advanced",
        { page, limit, title, company, location, description },
      ]
    : ["jobs", "basic", { page, limit, q }];

  const result = useQuery<JobsGetJobsResponse>({
    queryKey,
    queryFn: async () => {
      if (isAdvanced) {
        const { data } = await JobsService.getJobsAdvanced({
          query: { page, limit, title, company, location, description },
          throwOnError: true,
        });
        return data as unknown as JobRead[];
      }
      const { data } = await JobsService.getJobs({
        query: { page, limit, search: q },
        throwOnError: true,
      });
      return data as unknown as JobRead[];
    },
    suspense: true,
    keepPreviousData: true,
    staleTime: 60_000, // 1 min
    retry: 1,
  });

  return {
    data: result.data ?? [],
    isLoading: result.isLoading,
    isError: result.isError,
    hasMore: (result.data ?? []).length === limit,
  };
}
