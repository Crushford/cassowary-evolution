import React, { useState, useCallback } from 'react';
import {
  GameState,
  Coord,
  RoundOutcome,
  Upgrade,
  RareOffer,
} from '../types/game';
import {
  createInitialGameState,
  resolveRound,
  canPrestige,
  applyPrestige,
  maybeRollRareOffer,
  generateBoard,
  coordToKey,
} from '../game/gameLogic';
import { getUpgradeCost } from '../game/upgrades';
import { RARE_OFFERS } from '../config/gameConfig';
import { GameGrid } from './GameGrid';
import { GameStatusBar } from './GameStatusBar';
import { ActionPanel } from './ActionPanel';
import { UpgradeShop } from './UpgradeShop';
import { PrestigeModal } from './PrestigeModal';
import { RareOfferModal } from './RareOfferModal';
import { InstructionsModal } from './InstructionsModal';

export const CassowaryQueenGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | undefined>();
  const [showUpgradeShop, setShowUpgradeShop] = useState(false);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [showRareOffer, setShowRareOffer] = useState(false);
  const [currentRareOffer, setCurrentRareOffer] = useState<
    RareOffer | undefined
  >();
  const [showInstructions, setShowInstructions] = useState(true);

  const handleTileSelect = useCallback(
    (coord: Coord) => {
      if (gameState.roundComplete) return;

      const isAlreadySelected = gameState.selectedTiles.some(
        tile => tile.r === coord.r && tile.c === coord.c
      );

      if (isAlreadySelected) {
        // Deselect tile
        setGameState(prev => ({
          ...prev,
          selectedTiles: prev.selectedTiles.filter(
            tile => !(tile.r === coord.r && tile.c === coord.c)
          ),
        }));
      } else if (gameState.selectedTiles.length < 3) {
        // Select tile
        setGameState(prev => ({
          ...prev,
          selectedTiles: [...prev.selectedTiles, coord],
        }));
      }
    },
    [gameState.roundComplete, gameState.selectedTiles.length]
  );

  const handleLayEggs = useCallback(() => {
    if (gameState.selectedTiles.length !== 3) return;

    const outcome = resolveRound(gameState.selectedTiles, gameState);
    setRoundOutcome(outcome);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        chips: prev.player.chips + outcome.chipsDelta,
      },
      board: {
        ...prev.board,
        revealed: new Set(gameState.selectedTiles.map(coordToKey)),
      },
      roundComplete: true,
    }));

    // Check for rare offer
    if (maybeRollRareOffer()) {
      const randomOffer =
        RARE_OFFERS[Math.floor(Math.random() * RARE_OFFERS.length)];
      setCurrentRareOffer(randomOffer);
      setShowRareOffer(true);
    }
  }, [gameState]);

  const handleContinue = useCallback(() => {
    // Generate new board for next round
    const newBoard = generateBoard(gameState.era);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      selectedTiles: [],
      roundComplete: false,
    }));

    setRoundOutcome(undefined);

    // Check for prestige
    if (canPrestige(gameState)) {
      setShowPrestigeModal(true);
    }
  }, [gameState]);

  const handlePurchaseUpgrade = useCallback(
    (upgrade: Upgrade) => {
      const cost = getUpgradeCost(upgrade, upgrade.currentTier || 0);

      if (gameState.player.chips >= cost) {
        const newGameState = upgrade.effect(gameState);

        setGameState({
          ...newGameState,
          player: {
            ...newGameState.player,
            chips: newGameState.player.chips - cost,
          },
        });
      }
    },
    [gameState]
  );

  const handlePrestige = useCallback(() => {
    const newGameState = applyPrestige(gameState);
    setGameState(newGameState);
    setShowPrestigeModal(false);
    setRoundOutcome(undefined);
  }, [gameState]);

  const handleAcceptRareOffer = useCallback(() => {
    if (!currentRareOffer || gameState.player.chips < currentRareOffer.cost)
      return;

    // Apply the rare offer effect (simplified for v0.1)
    currentRareOffer.effect();

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        chips: prev.player.chips - currentRareOffer.cost,
      },
    }));

    setShowRareOffer(false);
    setCurrentRareOffer(undefined);
  }, [currentRareOffer, gameState.player.chips]);

  const handleDeclineRareOffer = useCallback(() => {
    setShowRareOffer(false);
    setCurrentRareOffer(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            🦚 Cassowary Queen
          </h1>
          <p className="text-lg text-amber-700">
            Lead your cassowary dynasty through the ages of evolution
          </p>
          <button
            onClick={() => setShowInstructions(true)}
            className="mt-2 text-sm text-amber-600 hover:text-amber-800 underline"
          >
            📖 How to Play
          </button>
        </div>

        {/* Game Status */}
        <GameStatusBar
          gameState={gameState}
          onPrestige={() => setShowPrestigeModal(true)}
        />

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Grid */}
          <div className="lg:col-span-2">
            <GameGrid
              board={gameState.board}
              selectedTiles={gameState.selectedTiles}
              onTileSelect={handleTileSelect}
              revealedTiles={gameState.board.revealed}
              hintedTiles={gameState.board.revealedHints}
            />
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <ActionPanel
              gameState={gameState}
              roundOutcome={roundOutcome}
              onLayEggs={handleLayEggs}
              onContinue={handleContinue}
              onShop={() => setShowUpgradeShop(true)}
              onRareOffer={
                showRareOffer ? () => setShowRareOffer(true) : undefined
              }
              rareOffer={currentRareOffer}
            />
          </div>
        </div>

        {/* Modals */}
        {showUpgradeShop && (
          <UpgradeShop
            gameState={gameState}
            onClose={() => setShowUpgradeShop(false)}
            onPurchaseUpgrade={handlePurchaseUpgrade}
          />
        )}

        {showPrestigeModal && (
          <PrestigeModal
            gameState={gameState}
            onPrestige={handlePrestige}
            onClose={() => setShowPrestigeModal(false)}
          />
        )}

        {showRareOffer && currentRareOffer && (
          <RareOfferModal
            offer={currentRareOffer}
            onAccept={handleAcceptRareOffer}
            onDecline={handleDeclineRareOffer}
            canAfford={gameState.player.chips >= currentRareOffer.cost}
          />
        )}

        {showInstructions && (
          <InstructionsModal onClose={() => setShowInstructions(false)} />
        )}
      </div>
    </div>
  );
};
