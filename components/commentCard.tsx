import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt, FaPlus, FaMinus } from "react-icons/fa"; 
import { saveCommentToLocalStorage } from "@/utils/localStorage";

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
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: boolean }>({});

  const isOP = comment.creator.userName === threadCreatorUserName;
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  const handleAddReply = (parentCommentId: number) => {
    const newReply: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: replyContent,
      creator: { userName: user?.username || "Unknown User" },
      creationDate: new Date().toISOString(),
      parentCommentId, 
    };

    setComments([...comments, newReply]);
    saveCommentToLocalStorage(newReply);

    setReplyContent("");
    setActiveReplyCommentId(null);

    // Only show the new reply and its parent comment's replies
    setVisibleReplies((prev) => ({
      ...prev,
      [parentCommentId]: true,  // Keep the parent comment's replies open
      [newReply.id]: true,      // Make the new reply visible
    }));
  };

  const toggleReplies = (commentId: number) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],  // Toggle visibility for the current comment's replies
    }));
  };

  return (
    <div className="relative">
      <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-2">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span>u/{comment.creator.userName}</span>
          {isOP && <span className="ml-1 text-blue-800 font-semibold">OP</span>}
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(creationDate)} ago</span>
        </div>
        <p className="text-sm text-gray-800">{comment.content}</p>

        {user && (
          <button
            onClick={() => setActiveReplyCommentId(comment.id)}
            className="flex items-center text-gray-700 text-sm mt-1"
          >
            <FaRegCommentAlt className="mr-1" /> Reply
          </button>
        )}

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

        {comments.filter((reply) => reply.parentCommentId === comment.id).length > 0 && (
          <button
            onClick={() => toggleReplies(comment.id)}
            className="text-gray-500 text-sm mt-1"
          >
            {visibleReplies[comment.id] ? (
              <>
                <FaMinus className="mr-1" /> Hide Replies
              </>
            ) : (
              <>
                <FaPlus className="mr-1" /> Show Replies
              </>
            )}
          </button>
        )}
      </div>

      {visibleReplies[comment.id] && (
        <div className="ml-6">
          {comments
            .filter((reply) => reply.parentCommentId === comment.id)
            .map((reply) => (
              <div key={reply.id} className="ml-4">
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  threadCreatorUserName={threadCreatorUserName}
                  comments={comments}
                  setComments={setComments}
                  user={user}
                  threadId={threadId}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
