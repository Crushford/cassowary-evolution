import React from 'react';
import { PanchinoBoard } from './components/PanchinoBoard';
import './styles/tokens.css';
import './styles/global.css';

function App() {
  return (
    <div className="bg-bg text-text min-h-dvh antialiased" data-theme="dark">
      <main className="flex min-h-dvh w-full flex-col">
        {/* Header */}
        <header className="xs:p-4 border-line w-full border-b p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="xs:max-w-sm 2xl:max-w-8xl 3xl:max-w-9xl 4xl:max-w-10xl mx-auto max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
            <div className="animate-fade-in text-center">
              <h1 className="xs:text-xl text-text xs:mb-2 mb-1 text-lg font-bold sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                Cassowary Panchino
              </h1>
              <p className="xs:text-sm text-dim text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                Dark-mode Pachinko machine with bioluminescent teal accents
              </p>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <section className="xs:p-4 w-full flex-1 p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="xs:max-w-sm 2xl:max-w-8xl 3xl:max-w-9xl 4xl:max-w-10xl mx-auto max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
            <PanchinoBoard />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
