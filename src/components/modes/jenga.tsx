import React from "react";
import { ButtonGroup, Button, Stack } from "react-bootstrap";
import { Rule } from "@/hooks/dataContext";
import Keypad from "@/components/keypad";
import RuleDisplay from "@/components/ruleDisplay";
import _ from "lodash";
import { useWeightedRules } from "@/hooks/useWeightedRules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";

const bigButtons = {
  height: "64px",
};

function generateJengaAssignments(rules: Rule[], optionCount: number): Record<string, Rule>[] {
  return _.times(52, () => {
    return _.times(optionCount, _.identity).reduce<Record<string, Rule>>((acc) => {
      const chosenCategories = Object.keys(acc);
      const reducedRules = _.reject(rules, (rule) => chosenCategories.includes(rule.category));
      if (reducedRules.length === 0) return acc;
      const chosenRule = _.sample(reducedRules);
      if (chosenRule) {
        acc[chosenRule.category] = chosenRule;
      }
      return acc;
    }, {});
  });
}

export default function Jenga() {
  const [jenga, setJenga] = React.useState<number | null>(null);
  const [ruleDisplay, setRuleDisplay] = React.useState<Rule | null>(null);
  const weightedRules = useWeightedRules();
  const [assignments,setAssignments] = React.useState<Record<string, Rule>[]>([]);

  React.useEffect(() => {
    setAssignments(generateJengaAssignments(weightedRules,3));
  }, [weightedRules]);

  if (assignments.length === 0) return <div>Loading...</div>;
  return (
    <div>
      {!jenga && !ruleDisplay && (
        <Keypad onSubmit={(value: number) => setJenga(value)} />
      )}
      {jenga && (
        <div>
          <RuleDisplay
            mode="tile"
            tile={jenga}
            backClicked={() => {
              setJenga(null);
              setRuleDisplay(null);
            }}
          />
          <ButtonGroup vertical className="w-100">
            {Object.values(assignments[jenga - 1]).map((rule: Rule) => (
              <Stack key={rule.category}>
                  <RuleDisplay rule={rule} mode={rule === ruleDisplay ? "rule" : "category"} selected={rule === ruleDisplay} onClick={() => setRuleDisplay(rule)}/>
              </Stack>
            ))}
            <Button
              style={bigButtons}
              onClick={() =>
                setRuleDisplay(
                  _.sample(Object.values(assignments[jenga - 1])) ||
                    null
                )
              }
            >
              <FontAwesomeIcon icon={faDice} className="fa-fw" />
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}
