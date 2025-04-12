import React, { createContext, useContext, useState } from 'react';

export type WeightMap = {
  [key: string]: number[];
};

interface WeightContextType {
  preset?: string;
  setPreset: (preset: string) => void;
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

export function WeightProvider({ children, defaultPreset, defaultWeights }: { children: React.ReactNode, defaultPreset: string, defaultWeights: WeightMap }) {
  const [preset, setPreset] = useState<string>(defaultPreset || "custom");
  const [weights, setWeights] = useState<WeightMap>(defaultWeights || {
    "Physical": [1, 1, 1, 1, 1],
    "Drinking": [1, 1, 1, 1, 1], 
    "Gameplay": [1, 1, 1, 1, 1],
    "Strip": [1, 1, 1, 1, 1],
    "Truth": [1, 1, 1, 1, 1]
  });

  return (
    <WeightContext.Provider value={{ preset, setPreset, weights, setWeights }}>
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

export function usePreset() {
  const context = useContext(WeightContext);
  if (context === undefined) {
    throw new Error('usePreset must be used within a WeightProvider');
  }
  return context;
}