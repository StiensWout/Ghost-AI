import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { editorUrl, signInPath } from "@/lib/auth-routes";

export default async function Home() {
  const { isAuthenticated } = await auth();

  redirect(isAuthenticated ? editorUrl : signInPath);
}
