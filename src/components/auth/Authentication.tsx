import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { User, UserContext } from "../../UserContext";

export default function Authentication() {
  const { setUser } = useContext(UserContext);

  const [formValues, setFormValues] = useState<User>({
    username: "",
    email: "",
    token: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_WS_URL}/register`, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    setUser(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          ChatUP
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="username"
            >
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formValues.username}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              className="outline-none mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="email"
            >
              Email
            </label>
            <input
              name="email"
              id="email"
              type="text"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              className="outline-none mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>

          <button className="w-full rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-700">
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
