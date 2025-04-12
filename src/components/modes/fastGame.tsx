import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import _ from 'lodash';
import { Rule } from '@/hooks/dataContext';
import RuleDisplay from '@/components/ruleDisplay';
import { useWeightedRules } from '@/hooks/useWeightedRules';

export default function FastGame() {
  const [rule, setRule] = React.useState<Rule | undefined>(undefined);
  const weightedRules = useWeightedRules();
  
  return (
    <div className="d-flex flex-column gap-3">
      <RuleDisplay mode="rule" rule={rule} />
      <ButtonGroup vertical className="w-100">
        <Button onClick={() => setRule(_.sample(weightedRules))}>
          <i className="fas fa-dice"></i>
          &nbsp; Random Rule
        </Button>
      </ButtonGroup>
    </div>
  );
}