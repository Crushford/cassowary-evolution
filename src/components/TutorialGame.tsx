import React, { useState, useCallback } from 'react';
import { TutorialGrid, TutorialRoundOutcome } from './TutorialGrid';
import { TutorialTopBar } from './TutorialTopBar';
import { TutorialResultPanel } from './TutorialResultPanel';

export const TutorialGame: React.FC = () => {
  const [chips, setChips] = useState(0);
  const [, setRoundNumber] = useState(1);
  const [showResultPanel, setShowResultPanel] = useState(false);
  const [currentOutcome, setCurrentOutcome] =
    useState<TutorialRoundOutcome | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState(0);

  const cap = 100; // Tutorial cap
  const maxPartners = 3;

  const handleRoundComplete = useCallback((outcome: TutorialRoundOutcome) => {
    setChips(prev => prev + outcome.chipsDelta);
    setCurrentOutcome(outcome);
    setShowResultPanel(true);
  }, []);

  const handleContinue = useCallback(() => {
    setRoundNumber(prev => prev + 1);
    setShowResultPanel(false);
    setCurrentOutcome(null);
    setSelectedPartners(0);
  }, []);

  const handleSelectionChange = useCallback((count: number) => {
    setSelectedPartners(count);
  }, []);

  const handleCloseResult = useCallback(() => {
    setShowResultPanel(false);
  }, []);

  const handleHelpClick = useCallback(() => {
    setShowInstructions(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Top Bar */}
      <TutorialTopBar
        chips={chips}
        cap={cap}
        partnersSelected={selectedPartners}
        maxPartners={maxPartners}
        onHelpClick={handleHelpClick}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            🦚 Cassowary Queen
          </h1>
          <p className="text-lg text-amber-700">
            Choose 3 nests. Flip to see what fate dealt.
          </p>
        </div>

        {/* Game Grid */}
        <div className="flex justify-center">
          <TutorialGrid
            onRoundComplete={handleRoundComplete}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Footer Hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-amber-600 italic">
            Pick 3 nests. Flip to see what fate dealt.
          </p>
        </div>
      </div>

      {/* Result Panel */}
      {showResultPanel && currentOutcome && (
        <TutorialResultPanel
          outcome={currentOutcome}
          onContinue={handleContinue}
          onClose={handleCloseResult}
        />
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How to Play - Tutorial Round
            </h3>

            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">
                  Objective:
                </h4>
                <p>
                  Select 3 nests around the Queen for your partners to explore.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Gameplay:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click tiles to select them (up to 3)</li>
                  <li>Click selected tiles to deselect them</li>
                  <li>Click "End Round" when you have 3 selections</li>
                  <li>Watch the tiles flip to reveal results</li>
                  <li>Collect chips from successful finds</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Results:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    🍎 <strong>Fruit:</strong> +10 chips
                  </li>
                  <li>
                    🍂 <strong>Barren:</strong> Nothing found
                  </li>
                  <li>
                    🦅 <strong>Predator:</strong> Dangerous encounter
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
