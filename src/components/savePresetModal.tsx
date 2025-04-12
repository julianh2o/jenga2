// import React from "react";
// import { Modal, Card, Button, Form } from "react-bootstrap";
// import { ConfigPresetSelector } from "@/components/configPresetSelector";

// interface SavePresetModalProps {
//   show: boolean;
//   onHide: () => void;
//   onSave: (preset: string) => void;
//   userPresets: string[];
// }

// function SavePresetModal({
//   show,
//   onHide,
//   onSave,
//   userPresets,
// }: SavePresetModalProps) {
//   const [preset, setPreset] = React.useState("");

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Save Preset</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Card className="mb-2">
//           <Card.Body>
//             <p>Replace existing</p>
//             <ConfigPresetSelector
//               disabled={userPresets.length === 0}
//               value={preset}
//               presets={userPresets}
//               onChange={(preset: string) => setPreset(preset)}
//             />
//             <Button
//               onClick={() => onSave(preset)}
//               disabled={userPresets.length === 0}
//               variant="primary"
//               className="mt-2 float-end"
//             >
//               Replace
//             </Button>
//           </Card.Body>
//         </Card>

//         <h2 className="mb-2 text-center text-primary">OR</h2>

//         <Card>
//           <Card.Body>
//             <p>Save as new</p>
//             <Form.Control
//               value={preset}
//               type="text"
//               placeholder="Enter preset name.."
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setPreset(e.target.value)
//               }
//             />
//             <Button
//               disabled={preset.length === 0}
//               onClick={() => onSave(preset)}
//               variant="primary"
//               className="mt-2 float-end"
//             >
//               Create
//             </Button>
//           </Card.Body>
//         </Card>
//       </Modal.Body>
//     </Modal>
//   );
// }
