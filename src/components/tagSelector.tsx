import { ToggleButton } from "react-bootstrap";
import _ from "lodash";

interface TagSelectorProps {
  tags: string[];
  value: Record<string, number[]>;
  onChange: (weights: Record<string, number[]>) => void;
}

export default function TagSelector({
  tags,
  value: weights,
  onChange,
}: TagSelectorProps) {
  const categoryStyle = {
    fontWeight: "bold" as const,
  };

  const doChange = (tag: string, value: number) => {
    console.log({ tag, value });
    const weightClone = _.cloneDeep(weights);
    _.set(
      weightClone,
      `${tag}`,
      _.times(5, () => value)
    );
    onChange(weightClone);
  };

  return (
    <div>
      <span style={categoryStyle}>Tags</span>
      <div className="d-flex gap-2">
        {tags.map((tag) => (
          <ToggleButton
            id={tag}
            className="btn-toggle"
            style={{ margin: 4 }}
            key={tag}
            type="checkbox"
            variant="outline-primary"
            value="1"
            checked={Boolean(_.get(weights, `${tag}.0`, 1))}
            onClick={() => doChange(tag, _.get(weights, `${tag}.0`, 1) ? 0 : 1)}
          >
            {tag}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
}
