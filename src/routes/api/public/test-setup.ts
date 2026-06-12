// TEMPORARY debug endpoint — removed after verifying admin product flow.
import { createFileRoute } from "@tanstack/react-router";

const TOKEN = "lov-debug-7f3a91";

export const Route = createFileRoute("/api/public/test-setup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { token?: string; action?: string };
        if (body.token !== TOKEN) return new Response("forbidden", { status: 403 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (body.action === "create") {
          const email = "lovable-test-admin@example.com";
          const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: "Test-Admin-7f3a91!",
            email_confirm: true,
          });
          if (error) return Response.json({ error: error.message }, { status: 500 });
          const { error: roleErr } = await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: created.user.id, role: "admin" });
          if (roleErr) return Response.json({ error: roleErr.message }, { status: 500 });
          return Response.json({ ok: true, userId: created.user.id });
        }

        if (body.action === "cleanup") {
          const { data } = await supabaseAdmin.auth.admin.listUsers();
          const u = data.users.find((x) => x.email === "lovable-test-admin@example.com");
          if (u) {
            await supabaseAdmin.from("user_roles").delete().eq("user_id", u.id);
            await supabaseAdmin.auth.admin.deleteUser(u.id);
          }
          await supabaseAdmin.from("products").delete().eq("slug", "lovable-test-product-7f3a91");
          return Response.json({ ok: true, removed: !!u });
        }

        return new Response("bad request", { status: 400 });
      },
    },
  },
});
