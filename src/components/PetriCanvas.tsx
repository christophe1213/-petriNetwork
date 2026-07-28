import type { DragEvent, MouseEvent as ReactMouseEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ConnectionMode,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PlaceNode from './PlaceNode';
import TransitionNode from './TransitionNode';
import type { PetriNode } from '@/hooks/type';
import type { PetriEdge } from '@/hooks/usePetriEdge';
;



const nodeTypes = { place: PlaceNode, transition: TransitionNode };

interface PetriCanvasProps {
  nodes: PetriNode[];
  edges: PetriEdge[];
  onNodesChange: OnNodesChange<PetriNode>;
  onEdgesChange: OnEdgesChange<PetriEdge>;
  onConnect: (connection: Connection) => void;
  onEdgeDoubleClick: (event: ReactMouseEvent, edge: PetriEdge) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  /** Appelé par ReactFlow quand un/des node(s) sont supprimés (touche Suppr, sélection...) */
  onNodesDelete?: (deleted: PetriNode[]) => void;
}

/** Wrapper ReactFlow réutilisable : ne connaît que ses props, aucun state interne. */
export default function PetriCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeDoubleClick,
  onDrop,
  onDragOver,
  onNodesDelete,
}: PetriCanvasProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeDoubleClick={onEdgeDoubleClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodesDelete={onNodesDelete}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
    >
      <Background />
      <Controls />
  
    </ReactFlow>
  );
}