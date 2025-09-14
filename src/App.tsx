import React from 'react';
import { Button } from './components/Button';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Evolution
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A React app with TypeScript, Tailwind CSS, ESLint, Prettier,
          Storybook, and Playwright
        </p>
        <div className="space-x-4">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
