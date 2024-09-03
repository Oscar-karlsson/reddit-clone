"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getThreadsFromLocalStorage,
  saveThreadsToLocalStorage,
} from "@/utils/localStorage";

const CreateThread = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("THREAD");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = () => {
    if (!title || !description) {
      setError("Fields cannot be empty");
      return;
    }

    const threads = getThreadsFromLocalStorage();
    const newThread: Thread = {
      id: Date.now(),
      title,
      category,
      creationDate: new Date().toISOString(),
      description,
      creator: { userName: "guest", password: "password" },
      commentCount: 0,
    };

    threads.push(newThread);
    saveThreadsToLocalStorage(threads);

    setTitle("");
    setCategory("THREAD");
    setDescription("");
    setError(null);

    router.push(`/${newThread.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Create New Thread
        </h1>

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value as ThreadCategory)}
          >
            <option value="THREAD">THREAD</option>
            <option value="QNA">QNA</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
            placeholder="Enter the description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Display error message if exists */}
        {error && <p className="text-red-500 mb-6 font-semibold">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
          onClick={handleSubmit}
        >
          Create Thread
        </button>
      </div>
    </div>
  );
};

export default CreateThread;
