import React from "react";
import { Form, Button, ListGroup, ToggleButton } from "react-bootstrap";
import _ from "lodash";

interface WeightSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function WeightSelector({
  value,
  onChange,
}: WeightSelectorProps) {
  const weightOptions = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5];
  return (
    <Form.Select
      value={value + ""}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(parseFloat(e.target.value))
      }
    >
      {weightOptions.map((weight) => (
        <option key={weight} value={weight}>
          {weight}
        </option>
      ))}
    </Form.Select>
  );
}
