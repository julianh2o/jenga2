import { Form } from "react-bootstrap";

interface ConfigPresetSelectorProps {
  value: string;
  presets: Array<{ name: string }>;
  custom?: boolean;
  onChange: (value: string) => void;
}

export default function ConfigPresetSelector(props: ConfigPresetSelectorProps) {
  return (
    <Form.Select
      value={props.value ? props.value : "custom"}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        props.onChange(e.target.value)
      }
    >
      {props.value === "" && <option value=""></option>}
      {props.presets.map((preset) => (
        <option key={preset.name} value={preset.name}>
          {preset.name}
        </option>
      ))}
      {props.custom && <option disabled>-----</option>}
      {props.custom && <option value="custom">Custom</option>}
    </Form.Select>
  );
}
