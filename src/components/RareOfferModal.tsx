import React from 'react';
import { RareOffer } from '../types/game';

interface RareOfferModalProps {
  offer: RareOffer;
  onAccept: () => void;
  onDecline: () => void;
  canAfford: boolean;
}

export const RareOfferModal: React.FC<RareOfferModalProps> = ({
  offer,
  onAccept,
  onDecline,
  canAfford,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="app-surface-2 rounded-lg shadow-soft max-w-2xl w-full mx-4">
        <div className="bg-danger text-ink-primary p-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-center">🧬 Rare Mutation Offer 🧬</h2>
          <p className="text-ink-primary/80 text-center mt-2">
            A dangerous evolutionary opportunity presents itself
          </p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-ink-primary mb-2">{offer.name}</h3>
            <div className="text-xl font-bold text-success mb-4">
              🍯 {offer.cost} nectar-chips
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-success/15 border border-success/30 rounded-lg p-4">
              <h4 className="font-bold text-success mb-2 flex items-center">
                ✅ Benefit
              </h4>
              <p className="text-ink-secondary text-sm">{offer.benefit}</p>
            </div>

            <div className="bg-danger/15 border border-danger/30 rounded-lg p-4">
              <h4 className="font-bold text-danger mb-2 flex items-center">⚠️ Risk</h4>
              <p className="text-ink-secondary text-sm">{offer.risk}</p>
            </div>
          </div>

          <div className="bg-warning/15 border border-warning/30 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-warning mb-2">🧬 Mutation Details:</h4>
            <p className="text-ink-secondary text-sm">
              This is a rare evolutionary opportunity that comes with both great benefits
              and significant risks. Mutations are unpredictable and may change the course
              of your evolution in unexpected ways. Choose carefully - there may not be
              another chance like this.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onAccept}
              disabled={!canAfford}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 ${
                canAfford
                  ? 'bg-danger hover:bg-danger/80 text-ink-primary shadow-soft'
                  : 'bg-app-2 text-ink-muted cursor-not-allowed border border-border/60'
              }`}
            >
              {canAfford ? '🧬 Accept Mutation' : 'Insufficient chips'}
            </button>
            <button
              onClick={onDecline}
              className="flex-1 bg-app-1 text-ink-secondary border border-border/60 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Decline Offer
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-ink-muted">
              Mutations are rare and risky. This offer may not appear again soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
