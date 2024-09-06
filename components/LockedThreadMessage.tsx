import { FaLock } from 'react-icons/fa';

type LockedThreadMessageProps = {
  message: string; // We can make this customizable if needed
};

const LockedThreadMessage: React.FC<LockedThreadMessageProps> = ({ message }) => {
  return (
    <div className="mt-2 bg-yellow-100 text-yellow-800 p-2 rounded-md text-xs flex items-center">
      <FaLock className="mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default LockedThreadMessage;
