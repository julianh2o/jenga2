import { Form, useForm } from "react-hook-form";
import { useState } from "react";
import type { NextPage } from "next";

interface FormData {
  name: string;
  stars: number;
}

const Home: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    setMessage("Submitting...");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Submitted successfully!");
        reset();
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Google Sheets Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: true })}
          placeholder="Your Name"
          className="border p-2 rounded w-full"
        />

        <select {...register("stars", { required: true })} className="border p-2 rounded w-full">
          <option value="">Select Stars</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Home;
