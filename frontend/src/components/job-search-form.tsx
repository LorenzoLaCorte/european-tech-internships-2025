import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route } from "@/routes/jobs";
import * as React from "react";

export function JobSearchForm({
  onSubmit,
}: {
  onSubmit: (val: string) => void;
}) {
  // Read the current “q” from the URL
  const { q } = Route.useSearch();
  const [term, setTerm] = React.useState(q);

  return (
    <div className="flex w-full gap-2">
      <Input
        type="search"
        name="q"
        placeholder="Search company, title…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit(term.trim());
          }
        }}
      />
      <Button
        variant="outline"
        type="button"
        onClick={() => onSubmit(term.trim())}
      >
        Search
      </Button>
    </div>
  );
}
