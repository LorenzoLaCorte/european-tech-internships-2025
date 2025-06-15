import { Button } from "@/components/ui/button";
import { Route, type SearchValues } from "@/routes/advanced";
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

  const handleClick = () =>
    onSubmit({
      title: titleTags.map((t) => t.text),
      company: companyTags.map((t) => t.text),
      location: locationTags.map((t) => t.text),
      description: descriptionTags.map((t) => t.text),
    });

  return (
    <div className="flex flex-col gap-2">
      <TagInput
        tags={titleTags}
        setTags={setTitleTags}
        placeholder="Title keywords"
      />
      <TagInput
        tags={companyTags}
        setTags={setCompanyTags}
        placeholder="Company keywords"
      />
      <TagInput
        tags={locationTags}
        setTags={setLocationTags}
        placeholder="Location keywords"
      />
      <TagInput
        tags={descriptionTags}
        setTags={setDescriptionTags}
        placeholder="Description keywords"
      />
      <Button variant="outline" type="button" onClick={handleClick}>
        Search
      </Button>
    </div>
  );
}
