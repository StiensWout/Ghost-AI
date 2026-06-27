import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { editorUrl, signInUrl } from "@/lib/auth-routes";

export default async function Home() {
  const { isAuthenticated } = await auth();

  redirect(isAuthenticated ? editorUrl : signInUrl);
}
