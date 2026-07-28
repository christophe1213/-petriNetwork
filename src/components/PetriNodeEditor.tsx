import type { PetriExport } from '@/hooks/type';
import { useJsonFileTransfer } from '@/hooks/useJsonFileTransfer';
import { usePetriDragAndDrop } from '@/hooks/usePetriDragAndDrop';
import type { PetriEdge } from '@/hooks/usePetriEdge';
import { usePetriGraph } from '@/hooks/usePetriGraph';
import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import Palette from './Palette';
import PetriToolbar from './PetriToollbarr';
import PetriCanvas from './PetriCanvas';
import PetriDescriptionPanel from './PetriDescriptionPanel';


export interface PetriNetEditorProps {
  /** Graphe initial à charger au montage (localStorage, API, fichier...) */
  initialGraph?: PetriExport | null;
  /** Appelé à chaque changement du graphe, avec sa forme sérialisable */
  onChange?: (graph: PetriExport) => void;
  onBuild?:()=>void
}

/**
 * Composant "chef d'orchestre" : ne contient plus de logique lourde lui-même,
 * il assemble usePetriGraph (state), usePetriDragAndDrop, useJsonFileTransfer,
 * et les composants de présentation PetriToolbar / PetriCanvas.
 *
 * Doit être monté à l'intérieur d'un <ReactFlowProvider> (fourni par
 * PetriNetEditorWithStorage, ou par le composant parent si besoin).
 */
export default function PetriNetEditor({ initialGraph, onChange, onBuild }: PetriNetEditorProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setEdgeWeight,
    addPlaceAt,
    addTransitionAt,
    serializeGraph,
    loadGraph,
    clearGraph,
    deleteSelected,
    onNodesDelete,
    updateNodeDescription
  } = usePetriGraph();

   // Node actuellement sélectionné (un seul à la fois pour l'édition de description
  const { onDragOver, onDrop } = usePetriDragAndDrop({
    onDropPlace: addPlaceAt,
    onDropTransition: addTransitionAt,
  });

  const { fileInputRef, exportJson, triggerImport, onImportFile } = useJsonFileTransfer({
    serializeGraph,
    loadGraph,
  });

  // Double-clic sur une flèche : modifier son poids (le nombre de jetons consommés/produits)
  const onEdgeDoubleClick = useCallback(
    (event: ReactMouseEvent, edge: PetriEdge) => {
      event.stopPropagation();
      const current = edge.data?.weight ?? 1;
      const input = prompt('Poids de cet arc (nombre de jetons) :', String(current));
      if (input === null) return;
      const weight = Math.max(1, Math.round(Number(input)));
      if (!Number.isFinite(weight)) return;
      setEdgeWeight(edge.id, weight);
    },
    [setEdgeWeight]
  );

  const handleClear = useCallback(() => {
    if (!confirm('Effacer tout le graphe ?')) return;
    clearGraph();
  }, [clearGraph]);

  // Chargement initial à partir de la prop `initialGraph`
  const didLoadRef = useRef(false);
  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    if (!initialGraph) return;
    try {
      loadGraph(initialGraph);
    } catch {
      // graphe initial invalide/corrompu : on ignore silencieusement
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGraph]);

  // Notifie le parent à chaque changement du graphe (au lieu d'écrire directement dans le localStorage)
  useEffect(() => {
    if (!didLoadRef.current) return;
    onChange?.(serializeGraph());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, serializeGraph]);

  return (
    <div className="flex h-screen">
      <Palette />
 
      <div className="relative flex-1">
        <PetriToolbar
          onExport={exportJson}
          onImportClick={triggerImport}
          onClear={handleClear}
          onDeleteSelected={deleteSelected}
          fileInputRef={fileInputRef}
          onFileChange={onImportFile}
          onBuild={onBuild}
        />
        <PetriCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodesDelete={onNodesDelete}
        />
      </div>
 
      <PetriDescriptionPanel nodes={nodes} onDescriptionChange={updateNodeDescription} />
      </div>
  );
}