import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "@/routes/jobs";
import React from "react";

interface DataTablePaginationProps {
  pageSize: number;
  hasMore: boolean;
}

export function DataTablePagination({
  pageSize,
  hasMore,
}: DataTablePaginationProps) {
  const { page, limit, q } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Helper to update both page and limit in the URL
  const updateSearch = (newPage: number, newLimit: number) =>
    navigate({
      to: ".",
      search: { page: newPage, limit: newLimit, q },
      replace: true,
    });

  // Local state for the page‐input field
  const [pageInput, setPageInput] = React.useState<string>(String(page));

  // Keep local input in sync when `page` changes externally
  React.useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // Handle when user commits a new page number
  const commitPageChange = () => {
    const parsed = Number(pageInput);
    if (Number.isNaN(parsed) || parsed < 1) {
      setPageInput(String(page));
      return;
    }
    updateSearch(parsed, limit);
  };

  return (
    <div className="flex items-center justify-between py-4">
      {/* Rows‐per‐page dropdown */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          defaultValue={`${pageSize}`}
          onValueChange={(val) => {
            const size = Number(val);
            updateSearch(1, size);
          }}
        >
          <SelectTrigger className="h-8 w-[80px]">
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

      {/* Navigation buttons with page number between Prev and Next */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearch(Math.max(1, page - 1), limit)}
          disabled={page === 1}
        >
          ‹ Prev
        </Button>

        <input
          type="number"
          min={1}
          className="page-input w-12 rounded border px-2 py-1 text-center text-sm"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={commitPageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearch(page + 1, limit)}
          disabled={!hasMore}
        >
          Next ›
        </Button>
      </div>
    </div>
  );
}
