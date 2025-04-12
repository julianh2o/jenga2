import _ from "lodash";
import React from "react";
import { JSX } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackspace,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

interface KeypadProps {
  onSubmit: (value: number) => void;
}

export default function Keypad({ onSubmit }: KeypadProps) {
  const [entry, setEntry] = React.useState("");

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    gridAutoRows: "minmax(85px, auto)",
  };

  const bigButtons = {
    height: "64px",
  };

  const keys = _.flatten([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ["del", 0, "ok"],
  ]);

  const display: Record<string, JSX.Element | null> = {
    del: <FontAwesomeIcon icon={faBackspace} className="fa-fw" />,
    ok: <FontAwesomeIcon icon={faCheckCircle} className="fa-fw" />,
  };

  const handleSubmit = () => {
    const numValue = parseInt(entry);
    if (isNaN(numValue)) {
      console.error("Invalid number entered:", entry);
      return;
    }
    if (numValue < 1 || numValue > 52) {
      console.error("Number must be between 1 and 52:", numValue);
      return;
    }
    onSubmit(numValue);
    setEntry("");
  };

  const behavior: Record<string, () => void> = {
    del: () => setEntry(entry.substring(0, entry.length - 1)),
    ok: handleSubmit
  };

  return (
    <div>
      <Form.Control type="text" value={entry} placeholder="Enter a number" />
      <div style={gridStyle} className="mx-4 my-2">
        {keys.map((key) => (
          <Button
            disabled={
              key === "ok" && (!entry || isNaN(parseInt(entry)) || parseInt(entry) > 52 || parseInt(entry) < 1)
            }
            style={bigButtons}
            key={key}
            onClick={() =>
              behavior[key.toString()]
                ? behavior[key.toString()]()
                : setEntry(entry + key)
            }
          >
            {display[key.toString()] || key}
          </Button>
        ))}
      </div>
    </div>
  );
}
