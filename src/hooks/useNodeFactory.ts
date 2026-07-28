import { useCallback, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PetriNode, PlaceData, TransitionData } from './type';

/**
 * Fabrique les données (et callbacks) des nodes "place" et "transition",
 * et gère les compteurs servant à générer des ids uniques (p1, p2, t1, ...).
 * Réutilisable indépendamment du reste de l'éditeur.
 */
export function useNodeFactory(setNodes: Dispatch<SetStateAction<PetriNode[]>>) {
  const placeCountRef = useRef(0);
  const transitionCountRef = useRef(0);

  const makePlaceData = useCallback(
    (id: string, label: string, description = ''): PlaceData => ({
      label,
      description,
      tokens: 0,
      onAddToken: () =>
        setNodes((nds) =>
          nds.map((n): PetriNode => {
            if (n.id === id && n.type === 'place') {
              return { ...n, data: { ...n.data, tokens: n.data.tokens + 1 } };
            }
            return n;
          })
        ),
      onRemoveToken: () =>
        setNodes((nds) =>
          nds.map((n): PetriNode => {
            if (n.id === id && n.type === 'place') {
              return { ...n, data: { ...n.data, tokens: Math.max(0, n.data.tokens - 1) } };
            }
            return n;
          })
        ),
      onRename: (newLabel: string) =>
        setNodes((nds) =>
          nds.map((n): PetriNode => {
            if (n.id !== id) return n;
            if (n.type === 'place') return { ...n, data: { ...n.data, label: newLabel } };
            return { ...n, data: { ...n.data, label: newLabel } };
          })
        ),
    }),
    [setNodes]
  );

  const makeTransitionData = useCallback(
    (id: string, label: string, description = ''): TransitionData => ({
      label,
      description,
      onRename: (newLabel: string) =>
        setNodes((nds) =>
          nds.map((n): PetriNode => {
            if (n.id !== id) return n;
            if (n.type === 'place') return { ...n, data: { ...n.data, label: newLabel } };
            return { ...n, data: { ...n.data, label: newLabel } };
          })
        ),
    }),
    [setNodes]
  );

  const createPlaceNode = useCallback(
    (position: { x: number; y: number }): PetriNode => {
      const id = `p${++placeCountRef.current}`;
      return {
        id,
        type: 'place',
        position,
        data: makePlaceData(id, `P${placeCountRef.current}`),
      };
    },
    [makePlaceData]
  );

  const createTransitionNode = useCallback(
    (position: { x: number; y: number }): PetriNode => {
      const id = `t${++transitionCountRef.current}`;
      return {
        id,
        type: 'transition',
        position,
        data: makeTransitionData(id, `T${transitionCountRef.current}`),
      };
    },
    [makeTransitionData]
  );

  const resetCounters = useCallback(() => {
    placeCountRef.current = 0;
    transitionCountRef.current = 0;
  }, []);

  /** Resynchronise les compteurs après un chargement (import JSON, localStorage...) */
  const syncCountersFromIds = useCallback((placeIds: string[], transitionIds: string[]) => {
    const maxOf = (ids: string[], prefix: string) =>
      ids.reduce((max, id) => {
        const n = Number(id.startsWith(prefix) ? id.slice(prefix.length) : NaN);
        return Number.isFinite(n) ? Math.max(max, n) : max;
      }, 0);
    placeCountRef.current = maxOf(placeIds, 'p');
    transitionCountRef.current = maxOf(transitionIds, 't');
  }, []);

  return {
    makePlaceData,
    makeTransitionData,
    createPlaceNode,
    createTransitionNode,
    resetCounters,
    syncCountersFromIds,
  };
}