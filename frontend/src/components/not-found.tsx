import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="
        flex
        flex-col
        min-h-screen
        items-center
        justify-center
        max-w-sm
        mx-auto
        text-center
      "
    >
      <h1
        className="
          text-8xl
          font-bold
          leading-none
          mb-4
          text-ui-main
        "
      >
        404
      </h1>
      <p className="text-md">Oops!</p>
      <p className="text-md">Page not found.</p>

      <Button
        asChild
        variant="outline"
        className="mt-4 border-ui-main text-ui-main"
      >
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
}
