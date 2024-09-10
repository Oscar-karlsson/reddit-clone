'use client';

import { useEffect, useState } from 'react';
import { getThreadsFromLocalStorage } from "../utils/localStorage";
import ThreadCard from "@/components/threadCard";
import Modal from 'react-modal';
import CreateThreadForm from "@/components/CreateThreadForm";
import { useSearch } from '../context/SearchContext';  // Same context for both search and tags

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery, setAvailableTags } = useSearch(); // Access both search query and available tags

  useEffect(() => {
    const storedThreads = getThreadsFromLocalStorage();
    setThreads(storedThreads);

    // Compute unique tags and set them in the context
    const uniqueTags = [...new Set(storedThreads.flatMap(thread => thread.tags || []))];
    setAvailableTags(uniqueTags);
  }, [setAvailableTags]);

  // Filter threads based on search query including tags
  const filteredThreads = threads.filter(thread => {
    if (!searchQuery) return true;
    return thread.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button 
        onClick={openModal} 
        className="inline-block mb-4 text-white bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create a New Thread
      </button>

      <ul className="space-y-4">
        {filteredThreads.length > 0 ? (
          filteredThreads
            .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            .map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
        ) : (
          <p className="text-gray-500 text-sm">No threads found matching your search query.</p>
        )}
      </ul>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Thread Modal"
        className="relative mx-auto w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &#x2715;
          </button>
        </div>
        <CreateThreadForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Home;
