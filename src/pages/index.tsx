import { Form, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRules } from "@/hooks/useRules";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Stack,
  Tab,
} from "react-bootstrap";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKeyboard,
  faDice,
  faSitemap,
  faList,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import Jenga from "@/components/modes/jenga";
import RuleDisplay from "@/components/ruleDisplay";

interface FormData {
  name: string;
  stars: number;
}

function createWeightedRules(rules,weights) {
  const lcm = leastCommonMultiple([1,..._.compact(_.flatten(Object.values(weights)))]);
  const integerWeights =_.mapValues(weights,(arr) => _.map(arr,w => w*lcm));
  const res = _.flatten(_.map(rules,(rule) => {
      const baseWeight = rule.weight !== undefined ? rule.weight : 1;
      const categoryLevelWeight = weights[rule.category][rule.level-1];
      const tagWeight = _.reduce(rule.tags,(product,tag) => product * _.get(weights,`${tag}.${rule.level-1}`,1),1);

      const totalWeight = baseWeight * categoryLevelWeight * tagWeight;
      return _.times(totalWeight,() => rule);
  }));
  return res;
}

function generateJengaAssignments(rules,weights,optionCount) {
  const weightedRules = createWeightedRules(rules,weights);
  return _.times(52,() => {
      return _.times(optionCount,_.identity).reduce((acc,v) => {
          const chosenCategories = Object.keys(acc);
          const reducedRules = _.reject(weightedRules,(rule) => chosenCategories.includes(rule.category));
          if (reducedRules.length === 0) return acc;
          const chosenRule = _.sample(reducedRules);
          acc[chosenRule.category] = chosenRule;
          return acc;
      },{});
  });
}

const sampleRules = (rules,n) => {
  const choices = [];
  let i = 0;
  while (choices.length < n) {
      const newChoice = _.sample(rules);
      const found = _.find(choices,rule => newChoice.rule === rule.rule);
      if (!found) choices.push(newChoice);
      if (i++ > n*10) {
          console.log("Ending infinite loop!!",rules.length,choices);
          break;
      }
  }

  return choices;
}

const serializePreset = (preset) => {
  const txt = `{"name":"${preset.name}","weights":{\n${_.map(categories,c => `\t"${c}":${JSON.stringify(preset.weights[c])}`).join(",\n")}\n}}`;
  return _.map(txt.split("\n"),s => "\t\t"+s).join("\n")
}

const countRules = (rules) => {
  const grouped = _.groupBy(rules,"rule");
  const res = _.reverse(_.sortBy(_.map(Object.entries(grouped),entry => {
      const [ruleText,rules] = entry;
      const rule = _.first(rules);
      const count = rules.length;
      return {rule,count};
  }),["count"]));
  return res;
}

interface JengaPaneProps {
  eventKey: string;
  title: string;
  children: React.ReactNode;
}

function JengaPane({ eventKey, title, children }: JengaPaneProps) {
  return (
    <Tab.Pane eventKey={eventKey} className="p-2 overflow-auto flex-column">
      <Alert variant="primary" className="text-center h2">
        {title}
      </Alert>
      <div className="d-flex flex-column justify-content-between overflow-auto">
        {children}
      </div>
    </Tab.Pane>
  );
}

const Home: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { rules, loading, error } = useRules();
  const [message, setMessage] = useState<string>("");
  const jengaChoices = 3;
  const data = props.data;
  const {defaultPresets, categories, tags: allTags} = processData(data);

  const [weights,setWeights] = React.useState(localStorage.getObject("weights") || _.first(defaultPresets).weights);
  const [weightedRules,setWeightedRules] = React.useState(createWeightedRules(data,weights));
  const [rule,setRule] = React.useState(null);
  const [showSaveModal,setShowSaveModal] = React.useState(false);
  const [preset,setPreset] = React.useState(localStorage.getObject("preset") || _.first(defaultPresets).name);
  const [userPresets,setUserPresets] = React.useState(localStorage.getObject("presets") || defaultPresets);
  const [assignments,setAssignments] = React.useState(generateJengaAssignments(data,weights,jengaChoices));

  React.useEffect(() => {
      const preamble = "#preset=";
      if (!window.location.hash.startsWith(preamble)) return;
      const raw = decodeURIComponent(window.location.hash.substring(preamble.length));
      const weights = JSON.parse(raw);
      setPreset("custom");
      setWeights(weights);
  },[]);

  React.useEffect(() => {
      window.weights = weights;
      setWeightedRules(createWeightedRules(data,weights));
  },[weights]);

  const configSelected = (weights, name) => {
      name = name || "custom";
      if (weights) {
          setAssignments(generateJengaAssignments(data,weights,jengaChoices));
          setWeights(weights);
          localStorage.setObject("weights",weights)
      }
      setPreset(name);
      localStorage.setObject("preset",name);
  };

  const selectPreset = (presetName) => {
      const preset = _.find(userPresets,{name:presetName});
      configSelected(preset && preset.weights,presetName);
  }

  const linkPreset = (weights) => {
      const link = `${window.location.origin + window.location.pathname}#preset=${encodeURIComponent(JSON.stringify(weights))}`;
      window.open(link,"_blank");
  }

  const deletePreset = (preset) => {
      if (!confirm("Are you sure you want to delete preset: "+preset)) return;
      const without = _.reject(userPresets,{"name":preset});
      localStorage.setObject("presets",without);
      setUserPresets(without);
      if (without.length) {
          configSelected(without[0].weights,without[0].name);
      } else {
          configSelected(null,"custom");
      }
  }

  const savePreset = (preset, weights) => {
      const existing = _.find(userPresets,{"name":preset});
      if (existing) {
          existing.weights = weights;
      } else {
          userPresets.push({
              "name":preset,
              weights
          });
      }
      const newPresets = _.reject(userPresets,{"name":""});
      setUserPresets(newPresets);
      localStorage.setObject("presets",newPresets);

      setShowSaveModal(false);
      setPreset(preset);
      localStorage.setObject("preset",preset);

      console.log(_.map(newPresets,preset => serializePreset(preset)).join(",\n"));
  }

  const resetPresets = () => {
      localStorage.clear();
      window.location = window.location.origin + window.location.pathname;
  }
  

  const onSubmit = async (data: FormData) => {
    setMessage("Submitting...");

    if (loading) {
      setMessage("Loading rules...");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Submitted successfully!");
        reset();
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Tab.Container id="maintabs" defaultActiveKey="jenga" className="flex">
        <Container style={{ height: "75px" }}>
          <Nav variant="primary" className="flex-row justify-content-between">
            <Navbar.Brand>Party Jenga</Navbar.Brand>
            <Stack className="align-middle" direction="horizontal">
              <Dropdown>
                <Dropdown.Toggle
                  as={React.forwardRef(
                    (
                      {
                        children,
                        onClick,
                      }: {
                        children: React.ReactNode;
                        onClick: (e: React.MouseEvent) => void;
                      },
                      ref: React.Ref<HTMLElement>
                    ) => (
                      // <Badge ref={ref} onClick={e => { e.preventDefault(); onClick(e); }}>{preset} <FontAwesomeIcon icon={faChevronDown} className="fa-fw" /></Badge>
                      <div>foo</div>
                    )
                  )}
                />
                <Dropdown.Menu>
                  {/* {_.map(userPresets, p => <Dropdown.Item onClick={e => { selectPreset(p.name); }}>{p.name}</Dropdown.Item>)} */}
                </Dropdown.Menu>
              </Dropdown>
            </Stack>
          </Nav>
          <Nav variant="tabs" className="flex-row">
            <Nav className="me-auto">
              <Nav.Link eventKey="jenga">
                <FontAwesomeIcon icon={faKeyboard} className="fa-fw" />
              </Nav.Link>
              <Nav.Link eventKey="fast">
                <FontAwesomeIcon icon={faDice} className="fa-fw" />
              </Nav.Link>
              <Nav.Link eventKey="choose">
                <FontAwesomeIcon icon={faSitemap} className="fa-fw" />
              </Nav.Link>
              <Nav.Link eventKey="list">
                <FontAwesomeIcon icon={faList} className="fa-fw" />
              </Nav.Link>
              <Nav.Link eventKey="config">
                <FontAwesomeIcon icon={faCog} className="fa-fw" />
              </Nav.Link>
            </Nav>
          </Nav>
        </Container>
        <Tab.Content className="overflow-hidden d-flex flex-column">
          <JengaPane eventKey="jenga" title="Jenga">
            <Jenga assignments={assignments} />
          </JengaPane>
          <JengaPane eventKey="fast" title="Fast">
            <RuleDisplay rule={rule} />
            <ButtonGroup vertical className="w-100">
              <Button onClick={() => setRule(_.sample(weightedRules))}>
                <i className="fas fa-dice"></i>
                &nbsp; Random Rule
              </Button>
            </ButtonGroup>
          </JengaPane>
          <JengaPane eventKey="choose" title="Choose and Pass">
            <ChoiceGame rules={weightedRules} choices={5} />
          </JengaPane>
          <JengaPane eventKey="list" title="Rule Listing">
            {countRules(weightedRules).map(({ rule, count }) => (
              <RuleDisplay compact weight={count} rule={rule} />
            ))}
          </JengaPane>
          <JengaPane eventKey="config" title="Configure">
            <Stack direction="horizontal" gap={2}>
              <ConfigPresetSelector
                custom
                value={preset}
                presets={userPresets}
                onChange={(preset) => selectPreset(preset)}
              />
              <Button
                variant="primary"
                onClick={() =>
                  prompt("Copy", JSON.stringify({ name: preset, weights }))
                }
              >
                <i className="fas fa-copy"></i>
              </Button>
              <Button
                disabled={preset !== "custom"}
                variant="success"
                onClick={() => setShowSaveModal(true)}
              >
                <i className="fas fa-save"></i>
              </Button>
              <Button onClick={() => linkPreset(weights)}>
                <i className="fas fa-link"></i>
              </Button>
              <Button
                disabled={preset === "custom"}
                variant="danger"
                onClick={() => deletePreset(preset)}
              >
                <i className="fas fa-times"></i>
              </Button>
            </Stack>
            <ConfigArray
              value={weights}
              categories={categories}
              onChange={(weights) => configSelected(weights, null)}
            />
            <TagSelector
              value={weights}
              tags={allTags}
              onChange={(weights) => configSelected(weights, null)}
            />
            <Stack direction="horizontal" gap={2} className={"mt-4"}>
              <Button variant="danger" onClick={resetPresets}>
                Reset Presets
              </Button>
            </Stack>
          </JengaPane>
        </Tab.Content>
      </Tab.Container>

      <h1 className="text-2xl font-bold mb-4">Google Sheets Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: true })}
          placeholder="Your Name"
          className="border p-2 rounded w-full"
        />

        <select
          {...register("stars", { required: true })}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Stars</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {rules &&
        rules.map((rule) => (
          <div key={rule.rule}>
            <h2>{rule.rule}</h2>
            <p>{rule.tags}</p>
            <p>{rule.level}</p>
          </div>
        ))}
    </div>
  );
};

export default Home;
