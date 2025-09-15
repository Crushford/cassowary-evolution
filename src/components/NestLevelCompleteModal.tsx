import React, { useEffect, useRef } from 'react';

interface NestLevelCompleteModalProps {
  level: number;
  onAdvance: () => void;
}

export const NestLevelCompleteModal: React.FC<NestLevelCompleteModalProps> = ({
  level,
  onAdvance,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="level-complete-modal"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="level-complete-title"
        aria-describedby="level-complete-description"
      >
        <h2 id="level-complete-title" className="text-2xl font-bold text-gray-900 mb-4">
          Level {level} Complete!
        </h2>

        <div id="level-complete-description" className="text-gray-700 mb-6">
          <p className="mb-4">
            Congratulations! You have successfully completed Level {level}.
          </p>
          <p className="text-sm text-gray-600">
            The rainforest is evolving. New challenges await in the next level.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            data-testid="btn-advance-level"
            onClick={onAdvance}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Advance to Level {level + 1}
          </button>
        </div>
      </div>
    </div>
  );
};
