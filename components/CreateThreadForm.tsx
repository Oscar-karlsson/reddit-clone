"use client";
import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import {
  getThreadsFromLocalStorage,
  saveThreadsToLocalStorage,
} from "@/utils/localStorage";

type CreateThreadFormProps = {
  onClose: () => void;
};

// List of premade tags
const availableTags = ["Discussion", "Help", "Feedback", "Announcement"];

const CreateThreadForm: React.FC<CreateThreadFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("THREAD");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 

  const router = useRouter();

  const handleTagSelection = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag) // Uncheck if already selected
        : [...prevTags, tag]
    );
  };

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
      creator: { userName: user?.username || "Unknown User" },
      commentCount: 0,
      tags: selectedTags, // Save selected tags
    };

    threads.push(newThread);
    saveThreadsToLocalStorage(threads);

    setTitle("");
    setCategory("THREAD");
    setDescription("");
    setError(null);

    onClose(); // Close the modal after creating the thread
    router.push(`/${newThread.id}`);
  };

  return (
    <form className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">
        Create New Thread
      </h1>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block sm:text-sm text-black"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value as ThreadCategory)}
        >
          <option value="THREAD">THREAD</option>
          <option value="QNA">QNA</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          placeholder="Enter the description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagSelection(tag)}
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 mr-4"
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Create Thread
        </button>
      </div>
    </form>
  );
};

export default CreateThreadForm;
