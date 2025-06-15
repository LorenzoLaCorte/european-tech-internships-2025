import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { AdvancedSearchForm } from "@/components/advanced-search-form";
import { DataTablePagination } from "@/components/data-table-pagination";
import { JobTable } from "@/components/job-table";
import { JobTableSkeleton } from "@/components/job-table-skeleton";

import { useAdvancedJobsQuery } from "@/hooks/use-advanced-jobs";

export const Route = createFileRoute("/advanced")({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    title: z.array(z.string()).catch([]),
    company: z.array(z.string()).catch([]),
    location: z.array(z.string()).catch([]),
    description: z.array(z.string()).catch([]),
  }),
  component: AdvancedPage,
});

export type SearchValues = {
  title: string[];
  company: string[];
  location: string[];
  description: string[];
};

function AdvancedPage() {
  const { limit } = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleSearch = (val: SearchValues) =>
    navigate({
      to: ".",
      search: { page: 1, limit, ...val },
      replace: true,
    });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <AdvancedSearchForm onSubmit={handleSearch} />
      <Suspense fallback={<JobTableSkeleton />}>
        <JobsTableContainer />
      </Suspense>
    </div>
  );
}

function JobsTableContainer() {
  const { data, hasMore } = useAdvancedJobsQuery();
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
