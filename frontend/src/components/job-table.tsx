import {
  type Column,
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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

/* ───────── helpers ───────── */
const titleCase = (s: string) =>
  s
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));

const ariaSort = (
  s: false | "asc" | "desc",
): "none" | "ascending" | "descending" =>
  s === "asc" ? "ascending" : s === "desc" ? "descending" : "none";

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
          if (!desc) return null;

          const truncated =
            desc.length > 30 ? `${desc.slice(0, 30).trimEnd()}…` : desc;
          const [open, setOpen] = React.useState(false);

          return desc.length <= 30 ? (
            desc
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <span className="cursor-pointer underline underline-offset-2">
                  {truncated}
                </span>
              </DialogTrigger>

              <DialogContent
                role="document"
                className="sm:w-[90vw] sm:h-[80vh] w-[98vw] h-[90vh] max-w-3xl overflow-auto"
              >
                <DialogHeader>
                  <DialogTitle>Description</DialogTitle>
                  <DialogDescription asChild>
                    <div>{desc}</div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
/* ─────────────────────────── */

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

  /* ―― virtualizer ―― */
  const scrollParentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 48, // quick guess; real height measured below
    overscan: 32, // smoother for track-pads
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows[0]?.start ?? 0;
  const paddingBottom = totalSize - (virtualRows.at(-1)?.end ?? totalSize);
  /* ―――――――――――――――― */

  if (data.length === 0) {
    return <div className="rounded-md border p-6 text-center">No results.</div>;
  }

  return (
    <div className="rounded-md border h-[70vh]">
      <div
        ref={scrollParentRef}
        className="h-full overflow-auto will-change-transform contain-strict"
      >
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    aria-sort={ariaSort(h.column.getIsSorted())}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {/* top spacer */}
            {paddingTop > 0 && (
              <TableRow style={{ height: paddingTop }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}

            {/* visible rows */}
            {virtualRows.map((vr) => {
              const row = table.getRowModel().rows[vr.index];
              return (
                <TableRow
                  key={row.id}
                  data-index={vr.index} /* 👈 required for measuring */
                  ref={rowVirtualizer.measureElement}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* bottom spacer */}
            {paddingBottom > 0 && (
              <TableRow style={{ height: paddingBottom }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
