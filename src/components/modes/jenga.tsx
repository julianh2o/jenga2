import React from "react";
import { ButtonGroup, Button, Stack } from "react-bootstrap";
import { Rule } from "@/hooks/useRules";
import Keypad from "@/components/keypad";
import RuleDisplay from "@/components/ruleDisplay";
import _ from "lodash";

interface JengaProps {
  assignments: Record<number, Rule[]>;
}

interface KeypadProps {
  onSubmit: (value: number) => void;
}

const bigButtons = {
  height: "64px",
};

export default function Jenga({ assignments }: JengaProps) {
  const [jenga, setJenga] = React.useState<string | null>(null);
  const [ruleDisplay, setRuleDisplay] = React.useState<Rule | null>(null);
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
