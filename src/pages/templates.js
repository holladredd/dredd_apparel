import Link from "next/link";

export async function getServerSideProps() {
  // Simple server-side fetch from internal API
  const res = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/templates`
  );
  const templates = await res.json();
  return { props: { templates } };
}

export default function Templates({ templates }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Templates</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/designer?template=${encodeURIComponent(t.svg)}`}
          >
            <a className="bg-white rounded shadow overflow-hidden block">
              <img
                src={t.thumbnail}
                alt={t.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold">{t.name}</h3>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
