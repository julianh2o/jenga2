import { Form, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRules } from "@/hooks/useRules";
import ConfigArray from "@/components/configArray";
import ChoiceGame from "@/components/modes/choiceGame";
import TagSelector from "@/components/tagSelector";
import ConfigPresetSelector from "@/components/configPresetSelector";
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
import _ from "lodash";

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
import { leastCommonMultiple } from "@/services/math";
import { useWeights, WeightProvider } from "@/hooks/weightContext";
import { useWeightedRules } from "@/hooks/useWeightedRules";


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
  const { loading, error } = useRules();

  const presets = [
    {
        "name": "Flat",
        "weights": {
          "Physical": [1, 1, 1, 1, 1],
          "Drinking": [1, 1, 1, 1, 1], 
          "Gameplay": [1, 1, 1, 1, 1],
          "Strip": [1, 1, 1, 1, 1],
          "Truth": [1, 1, 1, 1, 1]
        }
    },
    {"name": "Round 1","weights": {
        "Physical": [3, 2, 1, 0.25, 0],
        "Drinking": [2, 2, 2, 3, 3],
        "Gameplay": [1, 1, 1, 1, 1],
        "Strip": [1.5, 1.5, 1.5, 0.5, 0.5],
        "Truth": [1, 2, 2, 1.5, 1.5],
        "duo": [0,0,0,0,0],
    }},
    {"name":"Julian","weights":{"Physical":[2,3,1,1,0.75],"Drinking":[0,0.75,1,1,2],"Gameplay":[0.75,0.75,0.75,0.75,0.75],"Strip":[2,1,1,1,1],"Truth":[1,1,1,1.5,2],"darkroom":[0,0,0,0,0],"duo":[0,0,0,0,0],"nsfw":[1,1,1,1,1],"kissing":[1,1,1,1,1],"silly":[0,0,0,0,0],"serious":[1,1,1,1,1]}},
    {"name": "Round 2","weights": {
        "Physical": [0.5, 3, 2, 2, 1],
        "Drinking": [0, 0.75, 1.5, 1.5, 2],
        "Gameplay": [0, 0, 0.75, 1, 1],
        "Strip": [1, 1, 2, 2, 3],
        "Truth": [0, 0, 0.5, 1, 1.5],
        "duo": [0,0,0,0,0],
    }},
    {"name": "Round 3","weights":{
        "Physical": [ 1, 2, 2, 3, 3 ],
        "Drinking": [ 0.25, 0.25, 2, 2, 2 ],
        "Gameplay": [ 0, 0, 0.75, 0.75, 0.75 ],
        "Strip": [ 0, 0, 0.5, 0.5, 1 ],
        "Truth": [ 0, 0, 0, 0.25, 1.5 ],
        "duo": [0,0,0,0,0],
    }},
    {"name": "Duo","weights": {
        "Physical": [ 0, 0, 0, 0, 0 ],
        "Drinking": [ 0, 0, 0, 0, 0 ],
        "Gameplay": [ 0, 0, 0, 0, 0 ],
        "Strip": [ 1, 0, 0, 0, 0 ],
        "Truth": [ 1, 1, 1, 1, 1 ],
    }},
];

  const jengaChoices = 3;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <>
    <WeightProvider>
      <GameRoot 
        presets={presets}
      />
    </WeightProvider>
  </>
}
function GameRoot({ presets }: { presets: { name: string, weights: Record<string, number[]> }[] }) {
  const {weights,setWeights} = useWeights();
  const weightedRules = useWeightedRules();
  const [preset,setPreset] = React.useState(localStorage.getObject("preset") || _.first(presets)!.name);

  const configSelected = (weights, name) => {
      name = name || "custom";
      if (weights) {
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
            <Jenga />
          </JengaPane>
          <JengaPane eventKey="fast" title="Fast">
            <FastGameMode />
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
              <Button onClick={() => linkPreset(weights)}>
                <i className="fas fa-link"></i>
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
    </div>
  );
};

export default Home;
