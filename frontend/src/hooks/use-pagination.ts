import { Route } from "@/routes/jobs";

export function usePagination() {
  const search = Route.useSearch(); // { page, limit, q }
  const navigate = Route.useNavigate(); // typed navigate helper

  const update = (next: Partial<{ page: number; limit: number; q: string }>) =>
    navigate({
      // keep same pathname, replace search state
      search: (prev) => ({ ...prev, ...next }),
      // replace = true keeps history tidy
      replace: true,
    });

  return { ...search, update };
}
