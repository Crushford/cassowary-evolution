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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-center">
            🧬 Rare Mutation Offer 🧬
          </h2>
          <p className="text-red-100 text-center mt-2">
            A dangerous evolutionary opportunity presents itself
          </p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {offer.name}
            </h3>
            <div className="text-xl font-bold text-green-600 mb-4">
              🍯 {offer.cost} nectar-chips
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-2 flex items-center">
                ✅ Benefit
              </h4>
              <p className="text-green-800 text-sm">{offer.benefit}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-900 mb-2 flex items-center">
                ⚠️ Risk
              </h4>
              <p className="text-red-800 text-sm">{offer.risk}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-yellow-900 mb-2">
              🧬 Mutation Details:
            </h4>
            <p className="text-yellow-800 text-sm">
              This is a rare evolutionary opportunity that comes with both great
              benefits and significant risks. Mutations are unpredictable and
              may change the course of your evolution in unexpected ways. Choose
              carefully - there may not be another chance like this.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onAccept}
              disabled={!canAfford}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 ${
                canAfford
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAfford ? '🧬 Accept Mutation' : 'Insufficient chips'}
            </button>
            <button
              onClick={onDecline}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Decline Offer
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Mutations are rare and risky. This offer may not appear again
              soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
