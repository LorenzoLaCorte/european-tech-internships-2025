// import { createFileRoute } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { z } from "zod";

// import { JobsService, type JobsGetJobsResponse } from "@/client";
// import { JobTable } from "@/components/job-table";
// import { JobSearchForm } from "@/components/job-search-form";
// import { usePagination } from "@/hooks/use-pagination";

// export const Route = createFileRoute("/jobs")({
//   validateSearch: z.object({
//     page: z.coerce.number().int().min(1).default(1),
//     limit: z.coerce.number().int().min(1).max(100).default(10),
//     q: z.string().default(""),
//   }),

//   component: JobsPage,
// });

// function JobsPage() {
//   const { page, limit, q, update } = usePagination();

//   const { data, isLoading, error } = useQuery<JobsGetJobsResponse>({
//     queryKey: ["jobs", page, limit, q],
//     queryFn: async () =>
//       (
//         await JobsService.jobsGetJobs({
//           query: { page, limit, search: q },
//           throwOnError: true,
//         })
//       ).data,
//   });

//   if (error) return <p className="p-4 text-red-500">{String(error)}</p>;
//   if (isLoading || !data) return <p className="p-4">Loading…</p>;

//   return (
//     <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
//       <JobSearchForm search={q} onSubmit={(val) => update({ page: 1, q: val })} />

//       <JobTable data={data} />

//       <div className="mt-2 flex items-center gap-2 self-center">
//         <button
//           className="text-sm underline disabled:opacity-40"
//           onClick={() => update({ page: Math.max(page - 1, 1) })}
//           disabled={page === 1}
//         >
//           Prev
//         </button>
//         <span className="text-sm">{page}</span>
//         <button
//           className="text-sm underline"
//           onClick={() => update({ page: page + 1 })}
//         >
//           Next
//         </button>
//         <input
//           type="number"
//           min={1}
//           className="w-16 rounded border px-2 py-1 text-sm"
//           value={limit}
//           onChange={(e) => update({ page: 1, limit: Number(e.target.value) })}
//         />
//       </div>
//     </div>
//   );
// }

import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { JobSearchForm } from "@/components/job-search-form";
import { JobTable } from "@/components/job-table";
import { JobTableSkeleton } from "@/components/job-table-skeleton";

import { useJobsSuspenseQuery } from "@/hooks/use-jobs-query";
import { usePagination } from "@/hooks/use-pagination";

export const Route = createFileRoute("/jobs")({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().default(""),
  }),
  component: JobsPage,
});

function JobsPage() {
  const { page, limit, q, update } = usePagination();

  const handleSearch = (val: string) => update({ page: 1, q: val });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <JobSearchForm onSubmit={handleSearch} />

      {/* ------- only the ROWS suspend ------- */}
      <Suspense fallback={<JobTableSkeleton />}>
        <JobsTableContainer page={page} limit={limit} q={q} />
      </Suspense>
    </div>
  );
}

function JobsTableContainer({
  page,
  limit,
  q,
}: { page: number; limit: number; q: string }) {
  const { data } = useJobsSuspenseQuery({ page, limit, q }); // throws promise
  return <JobTable data={data} />;
}
