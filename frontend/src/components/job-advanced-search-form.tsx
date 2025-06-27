import { Button } from "@/components/ui/button";
import { Route, type SearchValues } from "@/routes/jobs";
import { type Tag, TagInput } from "emblor";
import * as React from "react";

export function AdvancedSearchForm({
  onSubmit,
}: {
  onSubmit: (val: SearchValues) => void;
}) {
  const search = Route.useSearch();

  const [titleTags, setTitleTags] = React.useState<Tag[]>(() =>
    search.title.map((t, i) => ({ id: i + "", text: t })),
  );
  const [companyTags, setCompanyTags] = React.useState<Tag[]>(() =>
    search.company.map((t, i) => ({ id: i + "", text: t })),
  );
  const [locationTags, setLocationTags] = React.useState<Tag[]>(() =>
    search.location.map((t, i) => ({ id: i + "", text: t })),
  );
  const [descriptionTags, setDescriptionTags] = React.useState<Tag[]>(() =>
    search.description.map((t, i) => ({ id: i + "", text: t })),
  );
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null,
  );

  React.useEffect(() => {
    setTitleTags(search.title.map((t, i) => ({ id: i + "", text: t })));
    setCompanyTags(search.company.map((t, i) => ({ id: i + "", text: t })));
    setLocationTags(search.location.map((t, i) => ({ id: i + "", text: t })));
    setDescriptionTags(
      search.description.map((t, i) => ({ id: i + "", text: t })),
    );
  }, [search]);

  /* disable when every field is empty */
  const nothingEntered =
    !titleTags.length &&
    !companyTags.length &&
    !locationTags.length &&
    !descriptionTags.length;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {/* four TagInputs – unchanged styling */}
      <TagInput
        placeholder="Title keywords"
        tags={titleTags}
        setTags={setTitleTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
        inlineTags
        styleClasses={{
          inlineTagsContainer: "flex-nowrap overflow-x-auto",
          tagList: { container: "flex-nowrap order-last" },
          input: "order-first flex-shrink-0",
        }}
      />

      <TagInput
        placeholder="Company keywords"
        tags={companyTags}
        setTags={setCompanyTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
        inlineTags
        styleClasses={{
          inlineTagsContainer: "flex-nowrap overflow-x-auto",
          tagList: { container: "flex-nowrap order-last" },
          input: "order-first flex-shrink-0",
        }}
      />

      <TagInput
        placeholder="Location keywords"
        tags={locationTags}
        setTags={setLocationTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
        inlineTags
        styleClasses={{
          inlineTagsContainer: "flex-nowrap overflow-x-auto",
          tagList: { container: "flex-nowrap order-last" },
          input: "order-first flex-shrink-0",
        }}
      />

      <TagInput
        placeholder="Description keywords"
        tags={descriptionTags}
        setTags={setDescriptionTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
        inlineTags
        styleClasses={{
          inlineTagsContainer: "flex-nowrap overflow-x-auto",
          tagList: { container: "flex-nowrap order-last" },
          input: "order-first flex-shrink-0",
        }}
      />

      <Button
        className="sm:col-span-2"
        type="button"
        onClick={() =>
          onSubmit({
            title: titleTags.map((t) => t.text),
            company: companyTags.map((t) => t.text),
            location: locationTags.map((t) => t.text),
            description: descriptionTags.map((t) => t.text),
          })
        }
        disabled={nothingEntered}
      >
        Advanced Search
      </Button>
    </div>
  );
}
