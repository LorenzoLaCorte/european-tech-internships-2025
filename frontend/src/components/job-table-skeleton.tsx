import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

export function JobTableSkeleton({
  cols = 8,
  rows = 8,
}: { cols?: number; rows?: number }) {
  // Prepare two arrays of UUIDs so we avoid using numeric indexes as keys
  const colKeys = useMemo(
    () => Array.from({ length: cols }).map(() => crypto.randomUUID()),
    [cols],
  );
  const rowKeys = useMemo(
    () => Array.from({ length: rows }).map(() => crypto.randomUUID()),
    [rows],
  );

  return (
    <div className="rounded-md border animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            {colKeys.map((colId) => (
              <TableHead key={colId}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rowKeys.map((rowId) => (
            <TableRow key={rowId}>
              {colKeys.map((colId) => (
                <TableCell key={`${rowId}-${colId}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
