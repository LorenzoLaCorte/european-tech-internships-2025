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
    search.title.map((t, i) => ({ id: String(i), text: t })),
  );
  const [companyTags, setCompanyTags] = React.useState<Tag[]>(() =>
    search.company.map((t, i) => ({ id: String(i), text: t })),
  );
  const [locationTags, setLocationTags] = React.useState<Tag[]>(() =>
    search.location.map((t, i) => ({ id: String(i), text: t })),
  );
  const [descriptionTags, setDescriptionTags] = React.useState<Tag[]>(() =>
    search.description.map((t, i) => ({ id: String(i), text: t })),
  );
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    setTitleTags(search.title.map((t, i) => ({ id: String(i), text: t })));
    setCompanyTags(search.company.map((t, i) => ({ id: String(i), text: t })));
    setLocationTags(
      search.location.map((t, i) => ({ id: String(i), text: t })),
    );
    setDescriptionTags(
      search.description.map((t, i) => ({ id: String(i), text: t })),
    );
  }, [search]);

  return (
    <div className="flex flex-col gap-2">
      <TagInput
        tags={titleTags}
        setTags={setTitleTags}
        placeholder="Title keywords"
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
      />
      <TagInput
        tags={companyTags}
        setTags={setCompanyTags}
        placeholder="Company keywords"
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
      />
      <TagInput
        tags={locationTags}
        setTags={setLocationTags}
        placeholder="Location keywords"
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
      />
      <TagInput
        tags={descriptionTags}
        setTags={setDescriptionTags}
        placeholder="Description keywords"
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        addTagsOnBlur
      />
      <Button 
        variant="outline"
        type="button"
        onClick={() =>
          onSubmit({
          title: titleTags.map((t) => t.text),
          company: companyTags.map((t) => t.text),
          location: locationTags.map((t) => t.text),
          description: descriptionTags.map((t) => t.text),
        })
        }
      >
        Advanced Search
      </Button>
    </div>
  );
}
