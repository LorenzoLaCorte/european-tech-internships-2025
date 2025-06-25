import logo from '@/static/logo.png';

export function Header() {
  return (
    <header className="w-full flex justify-center items-center py-4 border-b bg-white dark:bg-slate-950">
      <img src={logo} alt="Logo" className="h-10" />
    </header>
  );
}
