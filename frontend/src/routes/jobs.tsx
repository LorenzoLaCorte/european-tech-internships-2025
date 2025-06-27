import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { DataTablePagination } from "@/components/data-table-pagination";
import { AdvancedSearchForm } from "@/components/job-advanced-search-form";
import { JobSearchForm } from "@/components/job-search-form";

import { JobTable } from "@/components/job-table";
import { JobTableSkeleton } from "@/components/job-table-skeleton";
import { Switch } from "@/components/ui/switch";
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
    advanced: z.coerce.boolean().default(false),
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
  const search = Route.useSearch();
  const { limit, advanced } = search;
  const navigate = Route.useNavigate();

  /* Reset page on (advanced/)search */
  const handleSearch = (val: string) =>
    navigate({
      to: ".",
      search: {
        ...search,
        page: 1,
        limit,
        q: val,
        advanced: false,
        title: [],
        company: [],
        location: [],
        description: [],
      },
      replace: true,
    });

  const handleAdvancedSearch = (val: SearchValues) =>
    navigate({
      to: ".",
      search: { ...search, page: 1, limit, advanced: true, ...val },
      replace: true,
    });

  return (
    <section className="mx-auto w-full max-w-screen-2xl flex flex-col gap-4 p-4 sm:px-6 lg:px-8">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <Switch
          id="mode"
          checked={advanced}
          onCheckedChange={(checked) =>
            navigate({
              to: ".",
              search: {
                ...search,
                advanced: checked,
                q: "",
                page: 1,
                ...(checked
                  ? {}
                  : { title: [], company: [], location: [], description: [] }),
              },
              replace: true,
            })
          }
        />
        <label
          htmlFor="mode"
          className="cursor-pointer text-sm font-semibold text-muted-foreground"
        >
          {advanced ? "Advanced Search" : "Basic Search"}
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {advanced
          ? "Specify keywords for title, company, location and description."
          : "Search across title, company, location and description."}
      </p>

      {advanced ? (
        <AdvancedSearchForm onSubmit={handleAdvancedSearch} />
      ) : (
        <JobSearchForm onSubmit={handleSearch} />
      )}

      {/* Table + pagination */}
      <Suspense fallback={<JobTableSkeleton />}>
        <JobsTableContainer />
      </Suspense>
    </section>
  );
}

function JobsTableContainer() {
  const search = Route.useSearch();

  const advancedSearchActive = [
    search.title,
    search.company,
    search.location,
    search.description,
  ].some((fields) => fields.length > 0);

  const { data, hasMore } = useJobsQuery(advancedSearchActive);

  return (
    <>
      <JobTable data={data} />
      <DataTablePagination pageSize={search.limit} hasMore={hasMore} />
    </>
  );
}
