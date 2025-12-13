import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          Clothes Designer (Pages Router)
        </h1>
        <p className="mb-6">
          Choose a template or start designing from scratch.
        </p>
        <div className="flex gap-4">
          <Link href="/templates">
            <a className="px-4 py-2 bg-sky-600 text-white rounded">
              Browse Templates
            </a>
          </Link>
          <Link href="/designer">
            <a className="px-4 py-2 border border-sky-600 text-sky-600 rounded">
              Open Designer
            </a>
          </Link>
          <Link href="/login">
            <a className="px-4 py-2 border rounded">Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
