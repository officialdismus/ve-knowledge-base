import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // clear the authentication cookie by setting it with maxAge 0
  (await cookies()).set("ve_admin_auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
