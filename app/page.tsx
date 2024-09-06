'use client';

import { useEffect, useState } from "react";
import { getThreadsFromLocalStorage } from "../utils/localStorage";
import ThreadCard from "@/components/threadCard";
import Modal from 'react-modal';
import CreateThreadForm from "@/components/CreateThreadForm";



const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedThreads = getThreadsFromLocalStorage();
    setThreads(storedThreads);
  }, []);

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
        {threads
          .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
          .map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
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
        <CreateThreadForm onClose={closeModal} /> {/* Keep this form's title */}
      </Modal>
    </div>
  );
};

export default Home;
