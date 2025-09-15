import { signIn } from "@/lib/auth";

export default async function SignInPage() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        action={async () => {
          "use server";
          await signIn("credentials", { redirectTo: "/" });
        }}
      >
        <button className="px-4 py-2 rounded bg-black text-white">
          Continue with Google
        </button>
      </form>
    </main>
  );
}