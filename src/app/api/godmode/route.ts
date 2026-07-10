import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    // --- FIX: Validate using a private server-only secret (not NEXT_PUBLIC_*).
    // The godmode page no longer sends the secret from the client.
    // Instead, we use a hardcoded allow-list of admin emails stored in GODMODE_ADMIN_EMAILS
    // or simply require GODMODE_SECRET to be set to indicate the feature is enabled.
    const godmodeSecret = process.env.GODMODE_SECRET;
    if (!godmodeSecret) {
      console.error("GODMODE_SECRET is not configured on the server.");
      return NextResponse.json(
        { error: "God Mode is disabled: server configuration missing." },
        { status: 403 }
      );
    }

    // Verify the caller is authenticated before granting admin
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate against allowed admin emails from env
    const adminEmails = (process.env.GODMODE_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    if (!adminEmails.includes((user.email || "").toLowerCase())) {
      return NextResponse.json(
        { error: "Forbidden: your account is not allowed to activate God Mode." },
        { status: 403 }
      );
    }

    // Use service role to bypass RLS and update user metadata securely
    const serviceClient = createServiceRoleClient();
    
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, role: "admin" } }
    );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "God Mode Activated" });
    
  } catch (error: unknown) {
    console.error("God Mode Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to activate God Mode" },
      { status: 500 }
    );
  }
}
