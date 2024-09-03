import React from "react";
import { formatDistanceToNow } from "date-fns";

type CommentCardProps = {
  comment: ThreadComment;
};

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  // Provide a default date if creationDate is missing or invalid
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  return (
    <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-2">
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <span>u/{comment.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(creationDate)} ago</span>
      </div>
      <p className="text-sm text-gray-800">{comment.content}</p>
    </div>
  );
};

export default CommentCard;
