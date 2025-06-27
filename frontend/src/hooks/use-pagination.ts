import { type QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import type { JobRead } from "@/client";
import { JobsService } from "@/client/sdk.gen";
import { Route } from "@/routes/jobs";

export function useJobsQuery() {
  const { page, limit, q, title, company, location, description, advanced } =
    Route.useSearch();

  const filters = { title, company, location, description } as const;
  const isAdvanced =
    advanced ||
    Object.values(filters).some((arr) => (arr as string[]).length > 0);

  const queryKey: QueryKey = [
    "jobs",
    isAdvanced ? "advanced" : "basic",
    { page, limit, q, ...filters },
  ];

  const { data, isError, isFetching } = useSuspenseQuery<JobRead[], Error>({
    queryKey,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      if (isAdvanced) {
        const { data } = await JobsService.getJobsAdvanced({
          query: { page, limit, ...filters },
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
