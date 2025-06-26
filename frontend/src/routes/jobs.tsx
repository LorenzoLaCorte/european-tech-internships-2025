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

  // When user searches, reset page back to 1
  const handleSearch = (val: string) =>
    navigate({
      to: ".",
      search: {
        ...search,
        page: 1,
        limit: limit,
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
      search: { ...search, page: 1, limit: limit, advanced: true, ...val },
      replace: true,
    });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
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
          className="text-sm font-semibold text-muted-foreground cursor-pointer"
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

      {/* Only table + pagination will suspend */}
      <Suspense fallback={<JobTableSkeleton />}>
        <JobsTableContainer />
      </Suspense>
    </div>
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
      <DataTablePagination
        pageSize={Route.useSearch().limit}
        hasMore={hasMore}
      />
    </>
  );
}
