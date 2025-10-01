import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const { user } = await auth0.getSession();
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Link href="/auth/login">ログイン</Link>
      <p>login flag:{user ? "true" : "false"}</p>
      <p>tokens:{user && JSON.stringify(user)}</p>
    </div>
  );
}
