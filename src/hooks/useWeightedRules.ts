import _ from 'lodash';
import { useWeights } from './weightContext';
import { leastCommonMultiple } from '@/services/math';
import React from 'react';
import { Rule, useData } from './dataContext';

export function useWeightedRules() {
  const { rules } = useData();
  const { weights } = useWeights();

  const weightedRules = React.useMemo(() => {
    const lcm = leastCommonMultiple([1, ..._.compact(_.flatten(Object.values(weights)))]);
    
    const res = _.flatten(_.map(rules, (rule: Rule) => {
      const baseWeight = rule.weight !== undefined ? rule.weight : 1;
      const categoryLevelWeight = weights[rule.category][rule.level-1];
      const tagWeight = _.reduce(rule.tags, (product: number, tag) => {
        const weight = Number(_.get(weights, `${tag}.${rule.level-1}`, 1));
        return product * weight;
      }, 1);

      const totalWeight = baseWeight * categoryLevelWeight * tagWeight;
      return _.times(totalWeight, () => rule);
    }));

    return res;
  }, [rules, weights]);

  return weightedRules;
}