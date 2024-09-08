import React, { useState, useEffect } from "react";
import { useUser, SignInButton, useClerk } from '@clerk/nextjs';  // Import useClerk for manual redirection
import CommentCard from "./commentCard";

type CommentsSectionProps = {
  threadId: number;
  initialComments: ThreadComment[];
  onAddComment: (comment: ThreadComment) => void;
  showInput: boolean;  // Control visibility of comment input based on lock status
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId, initialComments, onAddComment, showInput }) => {
  const { user, isSignedIn } = useUser();  // Get the user's sign-in status
  const { redirectToSignIn } = useClerk();  // Use useClerk to manually trigger sign-in
  const [comments, setComments] = useState<ThreadComment[]>(initialComments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Function to handle adding a new comment
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

    setComments([...comments, newComment]);
    setCommentContent("");
    onAddComment(newComment);
    setError(null);  // Clear any previous error message
  };

  // Manually handle redirect when user clicks sign-in
  const handleSignInClick = () => {
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterSignIn', currentPath);  // Store current page URL in local storage

    // Manually open the sign-in modal with no afterSignInUrl
    redirectToSignIn({ mode: 'modal' });
  };

  // After sign-in, check if we need to redirect
  useEffect(() => {
    if (isSignedIn) {
      const redirectUrl = localStorage.getItem('redirectAfterSignIn');
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;  // Redirect to the saved URL
          localStorage.removeItem('redirectAfterSignIn');  // Clean up local storage
        }, 100);  // Slight delay to ensure modal closes before redirect
      }
    }
  }, [isSignedIn]);  // Trigger when the sign-in status changes

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>
      <ul>
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} /> 
        ))}
      </ul>

      {/* Conditional rendering based on user's sign-in status */}
      {isSignedIn ? (
        showInput ? (
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
        ) : (
          <p className="text-gray-500 mt-4">Comments are disabled because this thread is locked.</p>
        )
      ) : (
        <div className="text-gray-500 mt-4">
          Want to join the conversation? 
          {/* Handle sign-in manually */}
          <button onClick={handleSignInClick} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In to Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
