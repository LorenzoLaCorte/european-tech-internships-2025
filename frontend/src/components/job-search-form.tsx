import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route } from "@/routes/jobs";

export function JobSearchForm({
  onSubmit,
}: { onSubmit: (val: string) => void }) {
  const { q } = Route.useSearch(); // URL is the single source of truth

  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const val = (
          e.currentTarget.elements.namedItem("q") as HTMLInputElement
        ).value;
        onSubmit(val.trim());
      }}
    >
      <Input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search company, title…"
      />
      <Button variant="outline" type="submit">
        Search
      </Button>
    </form>
  );
}
