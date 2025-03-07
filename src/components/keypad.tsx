import _ from "lodash";
import React from "react";
import { JSX } from "react";
import { Form, Button } from "react-bootstrap";

interface KeypadProps {
  onSubmit: (value: string) => void;
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
    del: <i className="fas fa-backspace"></i>,
    ok: <i className="fas fa-check-circle"></i>,
  };

  const behavior: Record<string, () => void> = {
    del: () => setEntry(entry.substring(0, entry.length - 1)),
    ok: () => {
      onSubmit(entry);
      setEntry("");
    },
  };

  return (
    <div>
      <Form.Control type="text" value={entry} placeholder="Enter a number" />
      <div style={gridStyle} className="mx-4 my-2">
        {keys.map((key) => (
          <Button
            disabled={
              key === "ok" && (parseInt(entry) === null || parseInt(entry) > 52)
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
