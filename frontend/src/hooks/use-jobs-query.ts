import {
  type QueryFunctionContext,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { type JobsGetJobsResponse, JobsService } from "@/client";

/**
 * Suspense‐compatible hook. Internally uses
 * `useSuspenseQuery({ queryKey, queryFn: async ({ queryKey }) => … })`.
 */
export function useJobsSuspenseQuery({
  page,
  limit,
  q,
}: {
  page: number;
  limit: number;
  q: string;
}) {
  return useSuspenseQuery<JobsGetJobsResponse>({
    queryKey: ["jobs", page, limit, q],
    queryFn: async (ctx: QueryFunctionContext) => {
      // destructure exactly in the same order you put them into queryKey
      const [, p, l, searchTerm] = ctx.queryKey as [
        string,
        number,
        number,
        string,
      ];

      const response = await JobsService.getJobs({
        query: { page: p, limit: l, search: searchTerm },
        throwOnError: true,
      });
      return response.data;
    },
  });
}
