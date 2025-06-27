import {
  type Column,
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import type { JobsGetJobsResponse } from "@/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Build a ColumnDef<T> array from a “sample” row’s keys */
function makeColumns(
  sample: JobsGetJobsResponse[number],
): ColumnDef<typeof sample>[] {
  return Object.keys(sample).map((key) => {
    if (key === "link") {
      return {
        accessorKey: "link",
        header: () => <span className="sr-only">Link</span>,
        enableSorting: false,
        cell: ({ getValue }) => (
          <a
            href={String(getValue())}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline"
          >
            <ArrowUpRight className="h-3 w-3" />
            Open
          </a>
        ),
      };
    }
    if (key === "description") {
      return {
        accessorKey: "description",
        header: ({ column }) => (
          <SortBtn column={column} title={titleCase(key)} />
        ),
        cell: ({ getValue }) => {
          const desc = String(getValue() ?? "");
          const truncated = desc.length > 30 ? desc.slice(0, 30) + "..." : desc;
          const [open, setOpen] = React.useState(false);
          if (!desc) return null;
          return (
            <>
              <span>{truncated} </span>
              {desc.length > 30 && (
                <>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-1 h-auto text-xs align-baseline"
                      >
                        Read more
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:w-[90vw] sm:h-[80vh] w-[98vw] h-[90vh] max-w-3xl overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Description</DialogTitle>
                        <DialogDescription>{desc}</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </>
          );
        },
      };
    }

    return {
      accessorKey: key,
      header: ({ column }) => (
        <SortBtn column={column} title={titleCase(key)} />
      ),
    };
  });
}

function titleCase(s: string) {
  return s
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));
}
function SortBtn({
  column,
  title,
}: {
  column: Column<JobsGetJobsResponse[number], unknown>;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting()}
    >
      {title}
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

export function JobTable({ data }: { data: JobsGetJobsResponse }) {
  const columns = React.useMemo(
    () => (data.length ? makeColumns(data[0]) : []),
    [data],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
