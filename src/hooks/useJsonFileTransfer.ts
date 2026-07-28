import { useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { PetriExport } from './type';

interface UseJsonFileTransferOptions {
  serializeGraph: () => PetriExport;
  loadGraph: (graph: PetriExport) => void;
  fileName?: string;
}

/** Gère le téléchargement du graphe en JSON et son import depuis un fichier local. */
export function useJsonFileTransfer({
  serializeGraph,
  loadGraph,
  fileName = 'reseau-petri.json',
}: UseJsonFileTransferOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJson = useCallback(() => {
    const graph = serializeGraph();
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [serializeGraph, fileName]);

  const triggerImport = useCallback(() => fileInputRef.current?.click(), []);

  const onImportFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = ''; // permet de réimporter le même fichier plus tard
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const graph = JSON.parse(String(reader.result)) as PetriExport;
          loadGraph(graph);
        } catch {
          alert("Le fichier n'est pas un JSON de réseau de Petri valide.");
        }
      };
      reader.readAsText(file);
    },
    [loadGraph]
  );

  return { fileInputRef, exportJson, triggerImport, onImportFile };
}