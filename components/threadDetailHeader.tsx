import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsThreeDots } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { updateThreadLockStatus } from "@/utils/localStorage";
import LockedThreadMessage from "./LockedThreadMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ThreadDetailHeaderProps = {
  thread: Thread;
  onCommentIconClick: () => void; 
};

const ThreadDetailHeader: React.FC<ThreadDetailHeaderProps> = ({ thread, onCommentIconClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useUser(); // Get the current logged-in user
  const [isLocked, setIsLocked] = useState(thread.locked || false); // Add state to manage lock

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };


  const handleToggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
  
    // Update local storage with the new lock state
    updateThreadLockStatus(thread.id, newLockState);
  };

  return (
    <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm mb-6 relative">
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-gray-600 mb-1">r/{thread.category}</p>
        {user && user.username === thread.creator.userName && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer text-xl">
              <BsThreeDots className="cursor-pointer text-gray-400 text-xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 w-max bg-white border border-gray-300 shadow-lg rounded-lg z-10">
              <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">Thread Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-black"
                onClick={handleToggleLock}
              >
                <FaLock className="mr-2 text-gray-600" />
                {isLocked ? 'Unlock Thread' : 'Lock Thread'}  {/* Dynamic text */}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                <FaTrashAlt className="mr-2 text-red-600" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
  
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <span>u/{thread.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(new Date(thread.creationDate))} ago</span>
      </div>
  
      <h2 className="text-lg font-semibold text-gray-800 transition-colors mb-2">
        {thread.title}
      </h2>
      <p className="text-sm text-gray-700">{thread.description}</p>

      {isLocked && (
  <LockedThreadMessage message="This thread has been locked. New comments cannot be posted." />
)}

      <div className="flex items-center text-xs text-gray-500 mt-2">
        <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-400 transition-colors cursor-pointer"
             onClick={onCommentIconClick} 
        >
          <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
          <span className="text-sm font-semibold text-gray-700">{thread.commentCount}</span>
        </div>
      </div>
    </div>
  );
}

export default ThreadDetailHeader;
