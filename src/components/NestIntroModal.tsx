import React, { useEffect, useRef } from 'react';

interface NestIntroModalProps {
  onBegin: () => void;
}

export const NestIntroModal: React.FC<NestIntroModalProps> = ({ onBegin }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBegin();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBegin]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="intro-modal"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="intro-title"
        aria-describedby="intro-description"
      >
        <h2 id="intro-title" className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Cassowary Queen
        </h2>
        <div id="intro-description" className="text-gray-700 mb-6 space-y-3">
          <p>
            In the lush rainforest, you must choose where to place your precious
            figurines. Each nest card hides either fruit or barren ground.
          </p>
          <p>
            <strong>How to play:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Place exactly 3 figurines on different nest cards</li>
            <li>Each card flips immediately to show fruit or barren</li>
            <li>After placing all 3, remaining cards reveal with a shadow</li>
            <li>Surviving nests (fruit) multiply your population</li>
            <li>Complete 10 rounds to advance to the next level</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            data-testid="intro-begin"
            onClick={onBegin}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};
