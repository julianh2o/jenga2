import React from "react";
import { ButtonGroup, Button, Stack } from "react-bootstrap";
import { Rule } from "@/hooks/useRules";
import Keypad from "@/components/keypad";
import RuleDisplay from "@/components/ruleDisplay";
import _ from "lodash";
import { useWeightedRules } from "@/hooks/useWeightedRules";

interface KeypadProps {
  onSubmit: (value: number) => void;
}

const bigButtons = {
  height: "64px",
};

function generateJengaAssignments(rules,weights,optionCount) {
  const weightedRules = createWeightedRules(rules,weights);
  return _.times(52,() => {
      return _.times(optionCount,_.identity).reduce((acc,v) => {
          const chosenCategories = Object.keys(acc);
          const reducedRules = _.reject(weightedRules,(rule) => chosenCategories.includes(rule.category));
          if (reducedRules.length === 0) return acc;
          const chosenRule = _.sample(reducedRules);
          acc[chosenRule.category] = chosenRule;
          return acc;
      },{});
  });
}

export default function Jenga() {
  const [jenga, setJenga] = React.useState<string | null>(null);
  const [ruleDisplay, setRuleDisplay] = React.useState<Rule | null>(null);
  const weightedRules = useWeightedRules();
  const [assignments,setAssignments] = React.useState(generateJengaAssignments(weightedRules,jengaChoices));

  return (
    <div>
      {!jenga && !ruleDisplay && (
        <Keypad onSubmit={(value: string) => setJenga(value)} />
      )}
      {jenga && (
        <div>
          <RuleDisplay
            tile={jenga}
            backClicked={() => {
              setJenga(null);
              setRuleDisplay(null);
            }}
          />
          <ButtonGroup vertical className="w-100">
            {Object.values(assignments[parseInt(jenga) - 1]).map((rule: Rule) => (
              <Stack key={rule.category}>
                {rule === ruleDisplay ? (
                  <RuleDisplay rule={rule} selected={true} />
                ) : (
                  <Button
                    onClick={() => setRuleDisplay(rule)}
                    style={bigButtons}
                    className="mb-2"
                    key={rule.category}
                  >
                    {rule.category} {rule.level}
                  </Button>
                )}
              </Stack>
            ))}
            <Button
              style={bigButtons}
              onClick={() =>
                setRuleDisplay(
                  _.sample(Object.values(assignments[parseInt(jenga) - 1])) ||
                    null
                )
              }
            >
              <i className="fas fa-dice"></i>
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}
