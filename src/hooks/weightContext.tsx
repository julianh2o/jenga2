import React, { createContext, useContext, useState } from 'react';

type WeightMap = {
  [key: string]: number[];
};

interface WeightContextType {
  weights: WeightMap;
  setWeights: (weights: WeightMap) => void;
}

const WeightContext = createContext<WeightContextType | undefined>(undefined);

export function serializeWeightsToURL(weights: WeightMap) {
  const link = `${window.location.origin + window.location.pathname}#preset=${encodeURIComponent(JSON.stringify(weights))}`;
  return link;
}

export function deserializeWeightsFromHash(hash: string) {
  const preamble = "#preset=";
  if (!hash.startsWith(preamble)) return;
  const raw = decodeURIComponent(hash.substring(preamble.length));
  const weights = JSON.parse(raw);
  return weights;
}

export function WeightProvider({ children }: { children: React.ReactNode }) {
  const [weights, setWeights] = useState<WeightMap>({
    "Physical": [1, 1, 1, 1, 1],
    "Drinking": [1, 1, 1, 1, 1], 
    "Gameplay": [1, 1, 1, 1, 1],
    "Strip": [1, 1, 1, 1, 1],
    "Truth": [1, 1, 1, 1, 1]
  });

  return (
    <WeightContext.Provider value={{ weights, setWeights }}>
      {children}
    </WeightContext.Provider>
  );
}

export function useWeights() {
  const context = useContext(WeightContext);
  if (context === undefined) {
    throw new Error('useWeights must be used within a WeightProvider');
  }
  return context;
}
