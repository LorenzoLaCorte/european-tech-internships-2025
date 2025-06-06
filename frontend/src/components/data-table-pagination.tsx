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
  // Pull current page/limit/q from URL
  const { page, limit, q } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Helper to update URL params in one place
  const updateSearch = (newPage: number, newLimit: number) =>
    navigate({
      to: ".",
      search: { page: newPage, limit: newLimit, q },
      replace: true,
    });

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

      {/* Only show the page number, no label */}
      <div className="text-sm font-medium">{page}</div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearch(1, limit)}
          disabled={page === 1}
        >
          « First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearch(Math.max(1, page - 1), limit)}
          disabled={page === 1}
        >
          ‹ Prev
        </Button>

        {/* Display plain page number here */}
        {/* (already rendered above) */}

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearch(page + 1, limit)}
          disabled={!hasMore}
        >
          Next ›
        </Button>
        {/* “Last” disabled */}
        <Button variant="outline" size="sm" disabled className="opacity-50">
          Last »
        </Button>
      </div>
    </div>
  );
}
