import { Card, Stack, Button, Badge } from "react-bootstrap";
import { Rule } from "@/hooks/useRules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import RatingStars from "./ratingStars";

interface RuleDisplayProps {
  disabled?: boolean;
  selected?: boolean;
  compact?: boolean;
  tile?: number;
  mode: "category" | "tile" | "rule";
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
        <Stack direction="horizontal" gap={2}>
          {props.mode === "category" && (
            <span className="mx-auto">{props.rule?.category} {props.rule?.level}</span>
          )}
          {props.mode === "tile" && (
            <>
              {props.tile && <Card.Title>Tile {props.tile}</Card.Title>}
              {props.backClicked && (
                <Button
                  style={{ height: "42px", width: "42px" }}
                  className="ms-auto"
                  onClick={props.backClicked}
                >
                  <FontAwesomeIcon icon={faUndo} className="fa-fw" />
                </Button>
              )}
            </>
          )}
          {props.mode === "rule" && (
            <>
              {props.weight && (
                <Badge bg="primary">
                  {props.weight}x
                </Badge>
              )}
              <Badge bg="secondary">
                {props.rule?.category} {props.rule?.level}
              </Badge>
              <span className="flex-grow-1">{props.rule?.rule}</span>
              <RatingStars rule={props.rule} />
            </>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}
