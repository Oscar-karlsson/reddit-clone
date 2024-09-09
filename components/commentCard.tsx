import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt, FaPlus, FaMinus } from "react-icons/fa";
import { CiCirclePlus, CiCircleMinus  } from "react-icons/ci";
import { saveCommentToLocalStorage } from "@/utils/localStorage";
import { censorText } from "@/utils/censor"; 

type CommentCardProps = {
  comment: ThreadComment;
  threadCreatorUserName: string;
  comments: ThreadComment[];
  setComments: React.Dispatch<React.SetStateAction<ThreadComment[]>>;
  user: { username: string } | null;
  threadId: number;
};

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  threadCreatorUserName,
  comments,
  setComments,
  user,
  threadId,
}) => {
  const [replyContent, setReplyContent] = useState(""); 
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false); // Hide replies by default

  const isOP = comment.creator.userName === threadCreatorUserName;
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  // Apply censoring to the comment content
  const censoredContent = censorText(comment.content);

  // Recursive function to calculate total number of replies, including nested ones
  const getTotalReplyCount = (commentId: number): number => {
    const directReplies = comments.filter((reply) => reply.parentCommentId === commentId);
    let totalReplies = directReplies.length;

    directReplies.forEach((reply) => {
      totalReplies += getTotalReplyCount(reply.id); // Recursively count nested replies
    });

    return totalReplies;
  };

  // Get total replies (including nested ones)
  const totalReplyCount = getTotalReplyCount(comment.id);

  const handleAddReply = (parentCommentId: number) => {
    const newReply: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: replyContent,
      creator: { userName: user?.username || "Unknown User" },
      creationDate: new Date().toISOString(),
      parentCommentId,
    };
  
    // Update state and save to local storage
    setComments([...comments, newReply]);
    saveCommentToLocalStorage(newReply);
  
    setReplyContent("");
    setActiveReplyCommentId(null);
  
    // Automatically show replies after adding a new one
    setAreRepliesVisible(true); // This ensures the replies are visible after submission
  };

  return (
    <div className="relative">
      {/* Top-Level Comment Box */}
      <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-2">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span>u/{comment.creator.userName}</span>
          {isOP && <span className="ml-1 text-blue-800 font-semibold">OP</span>}
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(creationDate)} ago</span>
        </div>

        {/* Display censored comment content */}
        <p
          className="text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: censoredContent }} // Use this to handle the HTML
        ></p>

        {/* Reply button */}
        {user && (
          <button
            onClick={() => setActiveReplyCommentId(comment.id)}
            className="flex items-center text-gray-700 text-sm mt-1"
          >
            <FaRegCommentAlt className="mr-1 text-gray-700" /> Reply
          </button>
        )}

        {/* Show reply input only for the comment being replied to */}
        {activeReplyCommentId === comment.id && (
          <div className="mt-2">
            <textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full border rounded p-2 text-black"
            />
            <button
              onClick={() => handleAddReply(comment.id)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Reply
            </button>
          </div>
        )}

        {/* Collapse/Expand Replies */}
        {totalReplyCount > 0 && (
          <button
            onClick={() => setAreRepliesVisible(!areRepliesVisible)}
            className="text-gray-500 text-sm mt-1 flex items-center"
          >
            {areRepliesVisible ? (
            <CiCircleMinus size={20} className="mr-1" />
            ) : (
              <>
                <CiCirclePlus size={20} className="mr-1" />
                {totalReplyCount === 1 ? "1 more reply" : `${totalReplyCount} more replies`}
              </>
            )}
          </button>
        )}
      </div>

      {/* Replies */}
      {areRepliesVisible && (
        <div className="ml-6 p-2">
          {comments
            .filter((reply) => reply.parentCommentId === comment.id)
            .map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                threadCreatorUserName={threadCreatorUserName}
                comments={comments}
                setComments={setComments}
                user={user}
                threadId={threadId}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
