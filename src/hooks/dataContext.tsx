import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

export interface Preset {
  name: string;
  weights: Record<string, number[]>;
}

export interface Rule {
  id: string;
  rule: string;
  tags: string;
  level: number;
  weight: number;
  category: string;
  subcategory: string;
  originator: string;
  notes: string;
}

interface DataContextType {
  rules: Rule[];
  tags: string[];
  categories: string[];
  presets: Preset[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const fetchRules = async (): Promise<Rule[]> => {
  const response = await fetch('/api/rules');
  if (!response.ok) {
    throw new Error('Failed to fetch rules');
  }
  return response.json();
};

export function DataProvider({ children, presets }: { children: React.ReactNode, presets: Preset[] }) {
  const { data: rules = [], isLoading, error } = useQuery({
    queryKey: ['rules'],
    queryFn: fetchRules
  });

  const tags = _.uniq(_.flatten(_.map(rules, "tags")));
  const categories = _.uniq(_.map(rules, "category"));

  const context = {
    rules,
    tags,
    categories,
    presets,
  };

  return (
    <DataContext.Provider value={context}>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
