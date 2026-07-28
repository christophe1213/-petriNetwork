import type { Node } from '@xyflow/react';

export interface PlaceData extends Record<string, unknown> {
  label: string;
  tokens: number;
  description?: string;  
  onAddToken?: () => void;
  onRemoveToken?: () => void;
  onRename?: (label: string) => void;
}

export interface TransitionData extends Record<string, unknown> {
  label: string;
  description?: string;  
  onRename?: (label: string) => void;
}

export type PlaceNodeType = Node<PlaceData, 'place'>;
export type TransitionNodeType = Node<TransitionData, 'transition'>;
export type PetriNode = PlaceNodeType | TransitionNodeType;
export type PetriNodeKind = 'place' | 'transition';
export interface PetriExport {
  places: Array<{
    id: string;
    label: string;
    tokens: number;
    description?:string
    position: { x: number; y: number };
  }>;
  transitions: Array<{
    id: string;
    label: string;
    description?: string;   
    position: { x: number; y: number };
  }>;
  arcs: Array<{ source: string; target: string; weight: number, sourceHandle?: string;
    targetHandle?: string; }>;
}
