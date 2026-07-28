import { useCallback } from 'react';
import type { DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { PetriNodeKind } from './type';

interface UsePetriDragAndDropOptions {
  onDropPlace: (position: { x: number; y: number }) => void;
  onDropTransition: (position: { x: number; y: number }) => void;
}

/** Gère le drag & drop d'un élément de la Palette vers le canevas ReactFlow. */
export function usePetriDragAndDrop({ onDropPlace, onDropTransition }: UsePetriDragAndDropOptions) {
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/petri-node-type') as PetriNodeKind | '';
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (type === 'place') onDropPlace(position);
      else onDropTransition(position);
    },
    [screenToFlowPosition, onDropPlace, onDropTransition]
  );

  return { onDragOver, onDrop };
}