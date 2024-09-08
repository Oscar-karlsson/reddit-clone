import React, { useState, useEffect } from "react";
import CommentCard from "./commentCard";
import { useUser, SignInButton } from '@clerk/nextjs';
import { saveCommentToLocalStorage, getCommentsFromLocalStorage } from "@/utils/localStorage";


type CommentsSectionProps = {
  threadId: number;
  initialComments: ThreadComment[];
  onAddComment: (comment: ThreadComment) => void;
  showInput: boolean;
  threadCreatorUserName: string;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  threadId,
  initialComments,
  onAddComment,
  showInput,
  threadCreatorUserName,
}) => {
  const [comments, setComments] = useState<ThreadComment[]>(initialComments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null); // Moved here
  
  // Load comments from local storage when the component is mounted
  useEffect(() => {
    const storedComments = getCommentsFromLocalStorage(threadId); // Fetch comments from local storage
    setComments(storedComments); // Update the comments state with stored comments
  }, [threadId]); // Runs when the threadId changes or when the component mounts

  const handleAddComment = () => {
    if (commentContent.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }
  
    const newComment: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: commentContent,
      creator: { userName: user?.username || "Unknown User" },
      creationDate: new Date().toISOString(),
    };
  
    // Save to state
    setComments([...comments, newComment]);
  
    // Save to local storage
    saveCommentToLocalStorage(newComment);
  
    setCommentContent("");
    onAddComment(newComment);
    setError(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>
      <ul>
        {comments
          .filter((comment) => !comment.parentCommentId) // Only show top-level comments
          .map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              threadCreatorUserName={threadCreatorUserName}
              comments={comments}
              setComments={setComments}
              user={user}
              threadId={threadId}
              activeReplyCommentId={activeReplyCommentId} // Pass reply state
              setActiveReplyCommentId={setActiveReplyCommentId} // Pass setter
            />
          ))}
      </ul>

      {/* Conditional rendering based on user's sign-in status */}
      {isSignedIn ? (
        showInput && (
          <>
            <textarea
              placeholder="Add a comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border rounded p-2 mt-4 text-black"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Comment
            </button>
          </>
        )
      ) : (
        <div className="text-gray-500 mt-4">
          Want to join the conversation?
          <SignInButton mode="modal">
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ease-in-out">
              Sign In to Comment
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
