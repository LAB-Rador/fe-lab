import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()

  cookieStore.delete("auth-token")
  cookieStore.delete("USER_ID")
  cookieStore.delete(CONFIRMED_EMAIL)

  return NextResponse.json({ success: true })
}
