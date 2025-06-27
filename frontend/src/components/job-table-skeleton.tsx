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
}: {
  cols?: number;
  rows?: number;
}) {
  const colIdx = useMemo(() => [...Array(cols).keys()], [cols]);
  const rowIdx = useMemo(() => [...Array(rows).keys()], [rows]);

  return (
    <div className="animate-pulse rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {colIdx.map((c) => (
              <TableHead key={c}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowIdx.map((r) => (
            <TableRow key={r}>
              {colIdx.map((c) => (
                <TableCell key={c}>
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
