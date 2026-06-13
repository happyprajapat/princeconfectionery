import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Package, FolderTree, LogOut, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-20 text-center">
        <h1 className="font-display text-2xl">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">This account is not an admin.</p>
        <button onClick={signOut} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        <div className="p-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md gradient-warm text-primary-foreground font-display text-sm font-bold">P</span>
            <span className="font-display text-sm font-semibold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-display font-semibold">Admin</span>
            <button onClick={signOut} className="text-sm text-muted-foreground">Sign out</button>
          </div>
          <nav className="flex overflow-x-auto gap-1 px-2 pb-2">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${active ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full"><Outlet /></main>
      </div>
    </div>
  );
}
