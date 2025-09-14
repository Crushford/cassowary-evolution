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
    console.log(
      '🥚 handleLayEggs called with selectedTiles:',
      gameState.selectedTiles
    );

    if (gameState.selectedTiles.length !== 3) {
      console.log(
        '❌ Cannot lay eggs: need exactly 3 tiles, have',
        gameState.selectedTiles.length
      );
      return;
    }

    console.log('🎯 Current game state before resolution:', {
      era: gameState.era.name,
      playerChips: gameState.player.chips,
      selectedTiles: gameState.selectedTiles,
      roundComplete: gameState.roundComplete,
    });

    const outcome = resolveRound(gameState.selectedTiles, gameState);
    console.log('📊 Round outcome:', outcome);
    setRoundOutcome(outcome);

    const newChips = gameState.player.chips + outcome.chipsDelta;
    console.log('💰 Chip calculation:', {
      oldChips: gameState.player.chips,
      delta: outcome.chipsDelta,
      newChips,
    });

    setGameState(prev => {
      const newState = {
        ...prev,
        player: {
          ...prev.player,
          chips: newChips,
        },
        board: {
          ...prev.board,
          revealed: new Set(gameState.selectedTiles.map(coordToKey)),
        },
        roundComplete: true,
      };

      console.log('🔄 Game state updated:', {
        newChips: newState.player.chips,
        revealedTiles: Array.from(newState.board.revealed),
        roundComplete: newState.roundComplete,
      });

      return newState;
    });

    // Check for rare offer
    if (maybeRollRareOffer()) {
      const randomOffer =
        RARE_OFFERS[Math.floor(Math.random() * RARE_OFFERS.length)];
      setCurrentRareOffer(randomOffer);
      setShowRareOffer(true);
      console.log('🎁 Rare offer rolled:', randomOffer);
    }
  }, [gameState]);

  const handleContinue = useCallback(() => {
    console.log('➡️ handleContinue called');
    console.log('🎯 Current state before continue:', {
      era: gameState.era.name,
      playerChips: gameState.player.chips,
      roundComplete: gameState.roundComplete,
      revealedTiles: Array.from(gameState.board.revealed),
    });

    // Generate new board for next round
    const newBoard = generateBoard(gameState.era);
    console.log('🆕 New board generated:', {
      totalTiles: Object.keys(newBoard.tiles).length,
      revealed: newBoard.revealed.size,
      revealedHints: newBoard.revealedHints.size,
    });

    setGameState(prev => {
      const newState = {
        ...prev,
        board: newBoard,
        selectedTiles: [],
        roundComplete: false,
      };

      console.log('🔄 Game state updated for new round:', {
        newRevealedTiles: Array.from(newState.board.revealed),
        selectedTiles: newState.selectedTiles,
        roundComplete: newState.roundComplete,
      });

      return newState;
    });

    setRoundOutcome(undefined);

    // Check for prestige
    if (canPrestige(gameState)) {
      console.log('✨ Prestige available!');
      setShowPrestigeModal(true);
    } else {
      console.log(
        '❌ Prestige not available. Need',
        gameState.era.cap,
        'chips, have',
        gameState.player.chips
      );
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
    <div className="min-h-screen bg-app-0 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">
            🦚 Cassowary Queen
          </h1>
          <p className="text-lg text-ink-secondary">
            Lead your cassowary dynasty through the ages of evolution
          </p>
          <button
            onClick={() => setShowInstructions(true)}
            className="mt-2 text-sm text-accent hover:text-accent-600 underline"
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
