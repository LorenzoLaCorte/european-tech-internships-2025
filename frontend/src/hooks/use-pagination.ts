import type { JobRead } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";
import { type QueryKey, useSuspenseQuery } from "@tanstack/react-query";

/**
 * Query helper for both basic & advanced searches.
 * Uses `useSuspenseQuery`, so `<Suspense>` boundaries work
 * and `data` is always defined.
 */
export function useJobsQuery(isAdvanced = false) {
  const { page, limit, q, title, company, location, description } =
    Route.useSearch();

  const queryKey: QueryKey = [
    "jobs",
    isAdvanced ? "advanced" : "basic",
    { page, limit, q, title, company, location, description },
  ];

  const {
    data, // JobRead[]
    isError,
    isFetching, // useful for small inline spinners
  } = useSuspenseQuery<JobRead[], Error, JobRead[]>({
    queryKey,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      if (isAdvanced) {
        const { data } = await JobsService.getJobsAdvanced({
          query: { page, limit, title, company, location, description },
          throwOnError: true,
        });
        return data;
      }
      const { data } = await JobsService.getJobs({
        query: { page, limit, search: q },
        throwOnError: true,
      });
      return data;
    },
  });

  return {
    data,
    isError,
    isFetching,
    hasMore: data.length === limit,
  };
}
