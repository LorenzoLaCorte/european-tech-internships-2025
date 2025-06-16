import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { DataTablePagination } from "@/components/data-table-pagination";
import { JobSearchForm } from "@/components/job-search-form";
import { AdvancedSearchForm } from "@/components/job-advanced-search-form";

import { JobTable } from "@/components/job-table";
import { JobTableSkeleton } from "@/components/job-table-skeleton";

import { useJobsQuery } from "@/hooks/use-pagination";

export const Route = createFileRoute("/jobs")({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().default(""),
    title: z.array(z.string()).catch([]),
    company: z.array(z.string()).catch([]),
    location: z.array(z.string()).catch([]),
    description: z.array(z.string()).catch([]),
  }),
  component: JobsPage,
});

export type SearchValues = {
  title: string[];
  company: string[];
  location: string[];
  description: string[];
};

function JobsPage() {
  const { limit } = Route.useSearch();
  const navigate = Route.useNavigate();

  // When user searches, reset page back to 1
  const handleSearch = (val: string) =>
    navigate({
      to: ".",
      search: { page: 1, limit, q: val },
      replace: true,
  });

  const handleAdvancedSearch = (val: SearchValues) =>
    navigate({
      to: ".",
      search: { page: 1, limit, ...val },
      replace: true,
    });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <JobSearchForm onSubmit={handleSearch} />
      <AdvancedSearchForm onSubmit={handleAdvancedSearch} />

      {/* Only table + pagination will suspend */}
      <Suspense fallback={<JobTableSkeleton />}>
        <JobsTableContainer />
      </Suspense>
    </div>
  );
}

function JobsTableContainer() {
  // Suspense hook → throws while fetching
  const { data, hasMore } = useJobsQuery();
  return (
    <>
      <JobTable data={data} />
      <DataTablePagination
        pageSize={Route.useSearch().limit}
        hasMore={hasMore}
      />
    </>
  );
}
