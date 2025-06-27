import { type Tag, TagInput } from "emblor";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Route, type SearchValues } from "@/routes/jobs";

const FIELDS = ["title", "company", "location", "description"] as const;
type Field = (typeof FIELDS)[number];

const INLINE_TAG_STYLES = {
  inlineTagsContainer: "flex-nowrap overflow-x-auto",
  tagList: { container: "flex-nowrap order-last", tag: "h-8" },
  input: "order-first flex-shrink-0 h-8",
} as const;

type TagsByField = Record<Field, Tag[]>;

export function AdvancedSearchForm({
  onSubmit,
}: {
  onSubmit: (val: SearchValues) => void;
}) {
  const search = Route.useSearch();

  /** one shared focus index for keyboard nav */
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null,
  );

  const [tags, setTags] = React.useState<TagsByField>(
    () =>
      Object.fromEntries(
        FIELDS.map((field) => [
          field,
          search[field].map((t: string, i: number) => ({
            id: `${i}`,
            text: t,
          })),
        ]),
      ) as TagsByField,
  );

  React.useEffect(() => {
    setTags(
      Object.fromEntries(
        FIELDS.map((field) => [
          field,
          search[field].map((t: string, i: number) => ({
            id: `${i}`,
            text: t,
          })),
        ]),
      ) as TagsByField,
    );
  }, [search]);

  const nothingEntered = !Object.values(tags).some((arr) => arr.length);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <div key={field} className="min-w-0">
          <TagInput
            placeholder={`${field[0].toUpperCase()}${field.slice(1)} keywords`}
            tags={tags[field]}
            setTags={(newTags) =>
              setTags((prev) => ({ ...prev, [field]: newTags }))
            }
            activeTagIndex={activeTagIndex}
            setActiveTagIndex={setActiveTagIndex}
            addTagsOnBlur
            inlineTags
            styleClasses={INLINE_TAG_STYLES}
          />
        </div>
      ))}

      <Button
        className="sm:col-span-2"
        type="button"
        disabled={nothingEntered}
        onClick={() =>
          onSubmit(
            Object.fromEntries(
              FIELDS.map((f) => [f, tags[f].map((t) => t.text)]),
            ) as SearchValues,
          )
        }
      >
        Advanced Search
      </Button>
    </div>
  );
}
