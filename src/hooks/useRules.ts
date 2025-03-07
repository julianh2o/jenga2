import { useState, useEffect } from 'react';

export interface Rule {
  rule: string;
  tags: string;
  level: string;
  weight: number;
  category: string;
  subcategory: string;
  originator: string;
  notes: string;
}

export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/rules');
        if (!response.ok) {
          throw new Error('Failed to fetch rules');
        }
        const data = await response.json();
        setRules(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return { rules, loading, error };
};