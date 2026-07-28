import { useCallback } from 'react';
import { addEdge, useEdgesState, useNodesState, type Connection } from '@xyflow/react';
import type { PetriExport, PetriNode } from './type';

import { useNodeFactory } from './useNodeFactory';
import { makeEdge, type PetriEdge } from './usePetriEdge';

/**
 * Encapsule tout l'état et la logique du graphe de Petri (nodes/edges,
 * connexions, sérialisation vers/depuis PetriExport). Ne sait rien du
 * rendu ni du stockage : c'est le composant appelant qui décide d'où
 * vient le graphe initial et où va la sérialisation.
 */
export function usePetriGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PetriNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PetriEdge>([]);

  const {
    makePlaceData,
    makeTransitionData,
    createPlaceNode,
    createTransitionNode,
    resetCounters,
    syncCountersFromIds,
  } = useNodeFactory(setNodes);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          makeEdge(
            `e-${connection.source}-${connection.target}-${Date.now()}`,
            connection.source,
            connection.target,
            1,
            connection.sourceHandle,
            connection.targetHandle
          ),
          eds
        )
      ),
    [setEdges]
  );

  /** Modifie le poids d'un arc existant (utilisé par le double-clic sur une flèche) */
  const setEdgeWeight = useCallback(
    (edgeId: string, weight: number) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? makeEdge(e.id, e.source, e.target, weight, e.sourceHandle, e.targetHandle)
            : e
        )
      );
    },
    [setEdges]
  );

  const addPlaceAt = useCallback(
    (position: { x: number; y: number }) => {
      // createPlaceNode() incrémente le compteur d'id : on l'appelle une seule fois,
      // EN DEHORS du callback passé à setNodes. En StrictMode, React invoque ce
      // callback deux fois pour détecter les effets de bord impurs — si l'incrémentation
      // avait lieu dedans, le compteur sauterait des valeurs (P1, P3, P5...).
      const node = createPlaceNode(position);
      setNodes((nds) => nds.concat(node));
    },
    [setNodes, createPlaceNode]
  );

  const addTransitionAt = useCallback(
    (position: { x: number; y: number }) => {
      const node = createTransitionNode(position);
      setNodes((nds) => nds.concat(node));
    },
    [setNodes, createTransitionNode]
  );

  // Construit un PetriExport (structure sérialisable, sans les fonctions) à partir de l'état courant
  const serializeGraph = useCallback((): PetriExport => {
    return {
      places: nodes
        .filter((n): n is Extract<PetriNode, { type: 'place' }> => n.type === 'place')
        .map((n) => ({
          id: n.id,
          label: n.data.label,
          tokens: n.data.tokens,
          description: n.data.description ?? '',
          position: n.position,
        })),
      transitions: nodes
        .filter((n): n is Extract<PetriNode, { type: 'transition' }> => n.type === 'transition')
        .map((n) => ({
          id: n.id,
          label: n.data.label,
          description: n.data.description ?? '',
          position: n.position,
        })),
      arcs: edges.map((e) => ({
        source: e.source,
        target: e.target,
        weight: e.data?.weight ?? 1,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
      })),
    };
  }, [nodes, edges]);

  // Remplace l'état courant par un PetriExport (chargement initial, import JSON...)
  const loadGraph = useCallback(
    (graph: PetriExport) => {
      const loadedNodes: PetriNode[] = [
        ...graph.places.map((p) => ({
          id: p.id,
          type: 'place' as const,
          position: p.position,
          data: { ...makePlaceData(p.id, p.label, p.description), tokens: p.tokens },
        })),
        ...graph.transitions.map((t) => ({
          id: t.id,
          type: 'transition' as const,
          position: t.position,
          data: makeTransitionData(t.id, t.label, t.description),
        })),
      ];

      const loadedEdges: PetriEdge[] = graph.arcs.map((a, i) =>
        makeEdge(
          `e-${a.source}-${a.target}-${i}`,
          a.source,
          a.target,
          a.weight ?? 1,
          a.sourceHandle,
          a.targetHandle
        )
      );

      syncCountersFromIds(
        graph.places.map((p) => p.id),
        graph.transitions.map((t) => t.id)
      );
      setNodes(loadedNodes);
      setEdges(loadedEdges);
    },
    [makePlaceData, makeTransitionData, syncCountersFromIds, setNodes, setEdges]
  );

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetCounters();
  }, [setNodes, setEdges, resetCounters]);

  /** Supprime un node (place/transition) par id, ainsi que les arcs qui lui sont reliés. */
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  /** Supprime un arc par id. */
  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  /**
   * Supprime tous les éléments actuellement sélectionnés dans le canevas
   * (nodes et/ou edges), en nettoyant au passage les arcs qui pendent
   * dans le vide suite à la suppression d'un node.
   */
  const deleteSelected = useCallback(() => {
    const selectedNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    if (selectedNodeIds.size === 0 && !edges.some((e) => e.selected)) return;

    setNodes((nds) => nds.filter((n) => !selectedNodeIds.has(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)
      )
    );
  }, [nodes, edges, setNodes, setEdges]);

  /**
   * À brancher sur `onNodesDelete` de ReactFlow : quand un node est supprimé
   * via la touche Suppr/Backspace (sélection native ReactFlow), on nettoie
   * aussi les arcs qui y étaient reliés.
   */
  const onNodesDelete = useCallback(
    (deleted: PetriNode[]) => {
      const deletedIds = new Set(deleted.map((n) => n.id));
      setEdges((eds) => eds.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)));
    },
    [setEdges]
  );

  /** Met à jour la description d'un node (place ou transition) par id. */
  const updateNodeDescription = useCallback(
    (nodeId: string, description: string) => {
      setNodes((nds) =>
        nds.map((n): PetriNode => {
          if (n.id !== nodeId) return n;
          if (n.type === 'place') return { ...n, data: { ...n.data, description } };
          return { ...n, data: { ...n.data, description } };
        })
      );
    },
    [setNodes]
  );

  return {
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
    deleteNode,
    deleteEdge,
    deleteSelected,
    onNodesDelete,
    updateNodeDescription,
  };
}