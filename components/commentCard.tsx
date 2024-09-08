import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { saveCommentToLocalStorage } from "@/utils/localStorage";

type CommentCardProps = {
  comment: ThreadComment;
  threadCreatorUserName: string;
  comments: ThreadComment[];
  setComments: React.Dispatch<React.SetStateAction<ThreadComment[]>>;
  user: { username: string } | null; // Pass the user object
  threadId: number; // Pass the thread ID
};

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  threadCreatorUserName,
  comments,
  setComments,
  user,
  threadId,
}) => {
  const [replyContent, setReplyContent] = useState(""); // Stores the reply text
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);

  const isOP = comment.creator.userName === threadCreatorUserName;
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  const handleAddReply = (parentCommentId: number) => {
    const newReply: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: replyContent,
      creator: { userName: user?.username || "Unknown User" },
      creationDate: new Date().toISOString(),
      parentCommentId,  // Tie the reply to its parent comment
    };
  
    // Update state
    setComments([...comments, newReply]);
  
    // Save to local storage
    saveCommentToLocalStorage(newReply);
  
    setReplyContent("");
    setActiveReplyCommentId(null);
  };
  

  return (
    <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-2">
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <span>u/{comment.creator.userName}</span>
        {isOP && <span className="ml-1 text-blue-800 font-semibold">OP</span>}
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(creationDate)} ago</span>
      </div>
      <p className="text-sm text-gray-800">{comment.content}</p>

      {/* Reply button */}
      {user && (
        <button
          onClick={() => setActiveReplyCommentId(comment.id)}
          className="text-blue-500 text-sm mt-1"
        >
          Reply
        </button>
      )}

      {/* Show the reply input only for the comment being replied to */}
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

      {/* Display the replies for this comment */}
      <div className="ml-4">
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
    </div>
  );
};

export default CommentCard;
