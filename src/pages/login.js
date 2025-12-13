import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "demo@demo.com",
    password: "password",
  });

  if (session) {
    router.push("/");
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
    });
    if (res?.ok) router.push("/");
    else alert("Login failed - use demo@demo.com / password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Login (demo)</h2>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            className="w-full border p-2 rounded"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </label>
        <button className="w-full py-2 bg-sky-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}
