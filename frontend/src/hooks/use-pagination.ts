import type { JobRead } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";
import { type QueryKey, useQuery } from "@tanstack/react-query";

export function useJobsQuery(isAdvanced = false) {
  const { page, limit, q, title, company, location, description } =
    Route.useSearch();

  const queryKey: QueryKey = isAdvanced
    ? [
        "jobs",
        "advanced",
        { page, limit, title, company, location, description },
      ]
    : ["jobs", "basic", { page, limit, q }];

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<JobRead[], Error, JobRead[]>({
    queryKey,
    // @ts-ignore
    suspense: true,
    keepPreviousData: true,
    staleTime: 60_000,
    retry: 1,
    initialData: [] as JobRead[],
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
    isLoading,
    isError,
    hasMore: data.length === limit,
  };
}
