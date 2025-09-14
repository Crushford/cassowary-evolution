import React from 'react';
import { SPRITES } from '../assets/sprites';

export function SpriteShowcase() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Cassowary Queen - Sprite Showcase
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Jungle Tile */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Jungle Tile (Background)</h3>
            <div className="flex flex-col items-center gap-4">
              <div
                className="pixelated w-32 h-32 rounded-xl shadow"
                style={{
                  backgroundImage: `url('${SPRITES.jungle}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <p className="text-sm text-gray-600 text-center">
                Used as background for nest cards
              </p>
            </div>
          </div>

          {/* Cassowary Queen */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Cassowary Queen</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.queen}
                alt="Cassowary Queen"
                className="pixelated sprite-64"
              />
              <p className="text-sm text-gray-600 text-center">
                Center of the board, represents the flock
              </p>
            </div>
          </div>

          {/* Fruit - Quandong */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Fruit (Quandong)</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.fruitQuandong}
                alt="Quandong fruit (food)"
                className="pixelated sprite-48"
              />
              <p className="text-sm text-gray-600 text-center">
                Food source for the flock
              </p>
            </div>
          </div>

          {/* Fruit - Fig */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Fruit (Fig)</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.fruitFig}
                alt="Fig fruit (food)"
                className="pixelated sprite-48"
              />
              <p className="text-sm text-gray-600 text-center">Alternative food source</p>
            </div>
          </div>

          {/* Predator */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Predator (Thylacoleo)</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.predator}
                alt="Predator: Thylacoleo"
                className="pixelated sprite-48"
              />
              <p className="text-sm text-gray-600 text-center">Threat to the flock</p>
            </div>
          </div>

          {/* Blue Egg */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Blue Egg (Clutch)</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.eggBlue}
                alt="Blue cassowary egg (clutch)"
                className="pixelated sprite-48"
              />
              <p className="text-sm text-gray-600 text-center">
                Bet token for clutch placements
              </p>
            </div>
          </div>

          {/* EP DNA Icon */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Evolution Points</h3>
            <div className="flex flex-col items-center gap-4">
              <img
                src={SPRITES.epDNA}
                alt="Evolution points"
                className="pixelated sprite-48"
              />
              <p className="text-sm text-gray-600 text-center">
                DNA icon for evolution points
              </p>
            </div>
          </div>
        </div>

        {/* Size Examples */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Size Examples</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-center">
              <img
                src={SPRITES.queen}
                alt="Cassowary Queen - 32px"
                className="pixelated sprite-32 mx-auto mb-2"
              />
              <p className="text-xs">32px</p>
            </div>
            <div className="text-center">
              <img
                src={SPRITES.queen}
                alt="Cassowary Queen - 48px"
                className="pixelated sprite-48 mx-auto mb-2"
              />
              <p className="text-xs">48px</p>
            </div>
            <div className="text-center">
              <img
                src={SPRITES.queen}
                alt="Cassowary Queen - 64px"
                className="pixelated sprite-64 mx-auto mb-2"
              />
              <p className="text-xs">64px</p>
            </div>
            <div className="text-center">
              <img
                src={SPRITES.queen}
                alt="Cassowary Queen - 80px"
                className="pixelated sprite-80 mx-auto mb-2"
              />
              <p className="text-xs">80px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
