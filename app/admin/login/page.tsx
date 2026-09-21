import { login } from "../actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <form action={login} className="w-full max-w-sm space-y-4 border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Admin</h1>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#4A5DF9]"
        />
        {error && <p className="text-sm text-red-600">Wrong password.</p>}
        <button className="w-full bg-[#4A5DF9] px-4 py-3 text-sm font-medium text-white">Sign in</button>
      </form>
    </main>
  );
}
