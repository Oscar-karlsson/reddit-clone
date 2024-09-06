import React from "react";
import { useState } from "react";
import CommentCard from "./commentCard";
import { useUser } from '@clerk/nextjs';


type CommentsSectionProps = {
  threadId: number;
  initialComments: ThreadComment[];
  onAddComment: (comment: ThreadComment) => void;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId, initialComments, onAddComment }) => {
  const [comments, setComments] = useState<ThreadComment[]>(initialComments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null); 
  const { user } = useUser();

  const handleAddComment = () => {
    // Validate the comment content
    if (commentContent.trim() === "") { // Checks if the content is blank or just whitespace
      setError("Comment cannot be empty");
      return;
    }

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: commentContent,
      creator: { userName: user?.username || "Unknown User" }, // Use the logged-in user's username
      creationDate: new Date().toISOString(), 
    };
  
    setComments([...comments, newComment]);
    setCommentContent("");
    onAddComment(newComment);
    setError(null); // Clear the error once a valid comment is submitted
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>
      <ul>
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} /> 
        ))}
      </ul>
      <textarea
        placeholder="Add a comment"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="w-full border rounded p-2 mt-4 text-black"
      />
       {error && <p className="text-red-500">{error}</p>} {/* Display error if it exists */}
      <button
        onClick={handleAddComment}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentsSection;
