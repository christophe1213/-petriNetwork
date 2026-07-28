import { MarkerType, type Edge } from '@xyflow/react';

/** Un arc avec son poids stocké dans data.weight (affiché en label seulement si > 1) */
export type PetriEdge = Edge<{ weight: number }>;

export function makeEdge(
  id: string,
  source: string,
  target: string,
  weight: number,
  sourceHandle?: string | null,
  targetHandle?: string | null
): PetriEdge {
  return {
    id,
    source,
    target,
    sourceHandle: sourceHandle ?? undefined,
    targetHandle: targetHandle ?? undefined,
    type: 'default',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#222' },
    style: { stroke: '#222' },
    label: weight > 1 ? String(weight) : undefined,
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 4,
    labelStyle: { fontSize: 12, fontWeight: 600 },
    data: { weight },
  };
}