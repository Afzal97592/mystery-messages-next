"use client";
import { useSession, signIn, signOut } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 px-3 py-1" onClick={() => signIn()}>
        Sign In
      </button>
    </>
  );
};
export default Page;
