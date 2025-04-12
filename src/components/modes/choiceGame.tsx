import React from 'react';
import _ from 'lodash';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import { Rule } from '@/hooks/dataContext';
import RuleDisplay from '@/components/ruleDisplay';

interface ChoiceGameProps {
  rules: Rule[];
  choices: number;
}

function sampleRules(rules: Rule[], count: number): Rule[] {
  return _.sampleSize(rules, count);
}

export default function ChoiceGame({ rules, choices }: ChoiceGameProps) {
  const [draw, setDraw] = React.useState<Rule[]>(sampleRules(rules, choices));
  const [selected, setSelected] = React.useState<Rule[]>([]);
  const [locked, setLocked] = React.useState<Rule[] | null>(null);
  const [chosen, setChosen] = React.useState<Rule | null>(null);

  const filterPhase = !locked && !chosen;
  const choosePhase = locked && !chosen;
  const displayPhase = locked && chosen;

  const reset = (rules: Rule[]) => {
    setChosen(null);
    setLocked(null);
    setSelected([]);
    setDraw(sampleRules(rules, choices));
  }

  React.useEffect(() => reset(rules), [rules]);

  return (<Container>
    {filterPhase && <h2>Choose 2 and pass</h2>}
    {choosePhase && <h2>Choose</h2>}
    {displayPhase && <RuleDisplay rule={chosen} mode="rule" />}
    {!displayPhase && _.map(draw, rule => <RuleDisplay
      disabled={Boolean(locked && !locked.includes(rule))}
      selected={selected.includes(rule)}
      rule={rule}
      mode="rule"
      onClick={() => locked ? setChosen(rule) : (selected.includes(rule) ? setSelected(_.without(selected, rule)) : setSelected([...selected, rule]))}
    />)}
    <ButtonGroup vertical className="w-100">
      {filterPhase && <Button className="mb-2" onClick={() => setLocked(selected)}>
        Confirm and pass
      </Button>}

      {filterPhase && <Button onClick={() => reset(rules)}>
        <i className="fas fa-dice"></i>
        &nbsp;
        Reroll
      </Button>}

      {displayPhase && <Button onClick={() => reset(rules)}>
        Next
      </Button>}
    </ButtonGroup>
  </Container>)
}