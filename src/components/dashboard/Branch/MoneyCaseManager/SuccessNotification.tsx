import React, { useEffect, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface Props {
  message: string | null;
}

const SuccessNotification: React.FC<Props> = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [message]);

  if (!show || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
              Success
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setShow(false)}
              className="inline-flex text-green-400 hover:text-green-500 dark:text-green-300 dark:hover:text-green-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;