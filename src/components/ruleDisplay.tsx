import { Card, Stack, Button, Badge } from "react-bootstrap";
import { Rule } from "@/hooks/useRules";

interface RuleDisplayProps {
  disabled?: boolean;
  selected?: boolean;
  compact?: boolean;
  tile?: number;
  backClicked?: () => void;
  onClick?: () => void;
  rule?: Rule;
  weight?: number;
}

export default function RuleDisplay(props: RuleDisplayProps) {
  return (
    <Card
      bg={
        (props.disabled && "secondary") ||
        (props.selected ? "primary" : "light")
      }
      text={(props.disabled && "light") || props.selected ? "light" : "dark"}
      className={"mb-2"}
      style={{ opacity: props.disabled ? 0.5 : 1 }}
      onClick={props.onClick}
    >
      <Card.Body className={props.compact ? "p-1" : ""}>
        <Stack direction="horizontal">
          {props.tile && <Card.Title>Tile {props.tile}</Card.Title>}
          {props.backClicked && (
            <Button
              style={{ height: "42px", width: "42px" }}
              className="ms-auto"
              onClick={props.backClicked}
            >
              <i className="fas fa-undo"></i>
            </Button>
          )}
        </Stack>
        {(props.rule || props.weight) && (
          <div>
            {props.weight && (
              <Badge bg="primary" className="mx-1">
                {props.weight}x
              </Badge>
            )}
            <Badge bg="secondary" className="mx-1">
              {props.rule?.category} {props.rule?.level}
            </Badge>
            <span>{props.rule?.rule}</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
