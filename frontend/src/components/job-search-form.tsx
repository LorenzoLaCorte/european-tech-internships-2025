import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route } from "@/routes/jobs";
import * as React from "react";

export function JobSearchForm({
  onSubmit,
}: { onSubmit: (val: string) => void }) {
  const { q } = Route.useSearch();
  const [term, setTerm] = React.useState(q);

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(term.trim());
      }}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        id="search"
        type="search"
        placeholder="Search company, title…"
        className="flex-1"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={!term.trim()}
      >
        Search
      </Button>
    </form>
  );
}
