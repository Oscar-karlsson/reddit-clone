'use client';

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt } from "react-icons/fa";
import { censorText } from '@/utils/censor';  // Import the censorText function

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  // Censor the title and description using the censorText function
  const censoredTitle = censorText(thread.title);
  const censoredDescription = censorText(thread.description);

  return (
    <li>
      <Link 
        href={`/${thread.id}`} 
        className="block bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-300 transition duration-200 ease-in-out"
      >
        {/* Category and tags */}
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <p className="font-bold">r/{thread.category}</p>
          
          {/* Display tags next to the category */}
          {thread.tags && thread.tags.length > 0 && (
            <>
              <span className="mx-1">•</span>
              {thread.tags.map((tag) => (
                <span
                  key={`${thread.id}-${tag}`} // Ensures uniqueness
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-1"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>

        {/* Creator info and time */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>u/{thread.creator.userName}</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(new Date(thread.creationDate))} ago</span>
        </div>

        {/* Censored title and description */}
        <h2 
          className="text-lg font-semibold text-gray-800 transition-colors line-clamp-1"
          dangerouslySetInnerHTML={{ __html: censoredTitle }}
        ></h2>
        
        <p 
          className="text-sm text-gray-700 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: censoredDescription }}
        ></p>

        {/* Comment count */}
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-400 transition-colors">
            <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
            <span className="text-sm font-semibold text-gray-700">{thread.commentCount}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ThreadCard;
