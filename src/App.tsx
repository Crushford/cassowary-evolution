import React, { useEffect, useState } from 'react';
import { CassowaryQueenGame } from './components/CassowaryQueenGame';
import { NestCardsGame } from './components/NestCardsGame';
import Tutorial3x3 from './components/Tutorial3x3';

interface URLParams {
  seed?: string;
  foodCount?: number;
  barrenCount?: number;
  predatorCount?: number;
  testMode?: boolean;
  goal?: number;
  nestCards?: boolean;
  fastPeek?: boolean;
}

function App() {
  const [urlParams, setUrlParams] = useState<URLParams>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed: URLParams = {};

    if (params.has('seed')) {
      parsed.seed = params.get('seed') || undefined;
    }

    if (params.has('foodCount')) {
      parsed.foodCount = parseInt(params.get('foodCount') || '6', 10);
    }

    if (params.has('barrenCount')) {
      parsed.barrenCount = parseInt(params.get('barrenCount') || '2', 10);
    }

    if (params.has('predatorCount')) {
      parsed.predatorCount = parseInt(params.get('predatorCount') || '0', 10);
    }

    if (params.has('testMode')) {
      parsed.testMode = params.get('testMode') === '1';
    }

    if (params.has('goal')) {
      parsed.goal = parseInt(params.get('goal') || '100', 10);
    }

    if (params.has('nestCards')) {
      parsed.nestCards = params.get('nestCards') === '1';
    }

    if (params.has('fastPeek')) {
      parsed.fastPeek = params.get('fastPeek') === '1';
    }

    setUrlParams(parsed);
  }, []);

  // If we have nestCards parameter, show the Nest + Cards game
  if (urlParams.nestCards) {
    return (
      <NestCardsGame
        seed={urlParams.seed}
        testMode={urlParams.testMode}
        fastPeek={urlParams.fastPeek}
      />
    );
  }

  // If we have tutorial parameters, show the 3x3 tutorial
  if (
    urlParams.seed ||
    urlParams.foodCount !== undefined ||
    urlParams.barrenCount !== undefined ||
    urlParams.predatorCount !== undefined ||
    urlParams.testMode ||
    urlParams.goal !== undefined
  ) {
    return (
      <Tutorial3x3
        seed={urlParams.seed}
        foodCount={urlParams.foodCount}
        barrenCount={urlParams.barrenCount}
        predatorCount={urlParams.predatorCount}
        testMode={urlParams.testMode}
        goal={urlParams.goal}
      />
    );
  }

  return <CassowaryQueenGame />;
}

export default App;
