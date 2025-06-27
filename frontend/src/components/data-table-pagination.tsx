import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "@/routes/jobs";

interface DataTablePaginationProps {
  pageSize: number;
  hasMore: boolean;
}

export function DataTablePagination({
  pageSize,
  hasMore,
}: DataTablePaginationProps) {
  const search = Route.useSearch();
  const { page, limit } = search;
  const navigate = Route.useNavigate();

  const updateSearch = (newPage: number, newLimit: number) =>
    navigate({
      to: ".",
      search: { ...search, page: newPage, limit: newLimit },
      replace: true,
    });

  const [pageInput, setPageInput] = React.useState(String(page));
  React.useEffect(() => setPageInput(String(page)), [page]);

  const commitPageChange = () => {
    const parsed = Number(pageInput);
    if (Number.isNaN(parsed) || parsed < 1) {
      setPageInput(String(page));
      return;
    }
    updateSearch(parsed, limit);
  };

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* rows-per-page */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">Rows:</span>
        <Select
          defaultValue={`${pageSize}`}
          onValueChange={(val) => updateSearch(1, Number(val))}
        >
          <SelectTrigger className="h-8 w-[88px]">
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* prev / page / next */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-label="Previous page"
          size="sm"
          onClick={() => updateSearch(Math.max(1, page - 1), limit)}
          disabled={page === 1}
        >
          ‹ Prev
        </Button>

        <input
          aria-label="Page number"
          type="number"
          min={1}
          className="page-input w-14 rounded border px-2 py-1 text-center text-sm"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={commitPageChange}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />

        <Button
          aria-label="Next page"
          size="sm"
          onClick={() => updateSearch(page + 1, limit)}
          disabled={!hasMore}
        >
          Next ›
        </Button>
      </div>
    </nav>
  );
}
