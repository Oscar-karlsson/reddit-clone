import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsThreeDots } from 'react-icons/bs';
import { FaLock, FaTrashAlt } from 'react-icons/fa';
import { censorText } from '@/utils/censor'; // Import censorText function

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThreadDetailHeaderProps = {
  thread: Thread;
  onCommentIconClick: () => void;
  onToggleLock: () => void;
};

const ThreadDetailHeader: React.FC<ThreadDetailHeaderProps> = ({ thread, onCommentIconClick, onToggleLock }) => {
  const { user } = useUser(); // Get the current logged-in user

  // Apply the censorText function to both title and description
  const censoredTitle = censorText(thread.title);
  const censoredDescription = censorText(thread.description);

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
                onClick={onToggleLock} 
              >
                <FaLock className="mr-2 text-gray-600" />
                {thread.locked ? 'Unlock Thread' : 'Lock Thread'}
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

      {/* Use dangerouslySetInnerHTML to render censored title and description */}
      <h2 className="text-lg font-semibold text-gray-800 transition-colors mb-2"
          dangerouslySetInnerHTML={{ __html: censoredTitle }}></h2>

      <p className="text-sm text-gray-700"
         dangerouslySetInnerHTML={{ __html: censoredDescription }}></p>

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
};

export default ThreadDetailHeader;
