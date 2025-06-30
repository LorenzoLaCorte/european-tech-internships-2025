import logo from "@/static/logo.png";

export function Header() {
  return (
    <header className="w-full border-b bg-white py-4 dark:bg-slate-950">
      <div className="container mx-auto flex justify-center px-4">
        <img src={logo} alt="Company logo" className="h-10 w-auto" />
      </div>
    </header>
  );
}
