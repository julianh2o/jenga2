import { ListGroup, ToggleButton } from "react-bootstrap";
import WeightSelector from "@/components/weightSelector";
import _ from "lodash";

interface ConfigArrayProps {
  categories: string[];
  value: Record<string, number[]>;
  onChange: (weights: Record<string, number[]>) => void;
}

function ConfigArray({
  categories,
  value: weights,
  onChange,
}: ConfigArrayProps) {
  const categoryStyle = {
    fontWeight: "bold" as const,
  };

  const flexStyle = {
    display: "flex" as const,
    gap: "10px",
  };

  const doChange = (category: string, n: number, value: number) => {
    const weightClone = _.cloneDeep(weights);
    _.set(weightClone, `${category}.${n}`, value);
    onChange(weightClone);
  };

  return (
    <div>
      <ListGroup variant="flush">
        {categories.map((category) => (
          <ListGroup.Item key={category} style={{ padding: "5px 0" }}>
            <span style={categoryStyle}>{category}</span>
            <div style={flexStyle}>
              {_.times(5, (n) => (
                <div key={n}>
                  <WeightSelector
                    value={weights && weights[category] && weights[category][n]}
                    onChange={(value) => doChange(category, n, value)}
                  />
                </div>
              ))}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

interface TagSelectorProps {
  tags: string[];
  value: Record<string, number[]>;
  onChange: (weights: Record<string, number[]>) => void;
}

function TagSelector({ tags, value: weights, onChange }: TagSelectorProps) {
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
            className="btn-toggle"
            style={{ margin: 4 }}
            key={tag}
            type="checkbox"
            variant="outline-primary"
            value="1"
            checked={_.get(weights, `${tag}.0`, 1) ? true : false}
            onClick={() => doChange(tag, _.get(weights, `${tag}.0`, 1) ? 0 : 1)}
            id={""}
          >
            {tag}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
}
