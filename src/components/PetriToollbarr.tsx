import type { ChangeEvent, RefObject } from 'react';

interface PetriToolbarProps {
  onExport: () => void;
  onImportClick: () => void;
  onClear: () => void;
  /** Supprime le(s) élément(s) actuellement sélectionné(s) dans le canevas (place, transition, arc) */
  onDeleteSelected: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBuild?: () => void;
}

const buttonBase =
  'inline-flex items-center justify-center rounded-md px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

/** Barre d'outils flottante : purement présentationnelle, aucune logique métier. */
export default function PetriToolbar({
  onExport,
  onImportClick,
  onClear,
  onDeleteSelected,
  fileInputRef,
  onFileChange,
  onBuild,
}: PetriToolbarProps) {
  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
      {onBuild && (
        <button
          onClick={onBuild}
          title="Lancer la simulation"
          className={`${buttonBase} bg-green-500 px-2.5 hover:bg-green-600`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      <button onClick={onExport} className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}>
        Exporter 
      </button>

      <button onClick={onImportClick} className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}>
        Importer
      </button>

      <button
        onClick={onDeleteSelected}
        className={`${buttonBase} bg-orange-500 hover:bg-orange-600`}
      >
        Supprimer la sélection
      </button>

      <button onClick={onClear} className={`${buttonBase} bg-red-600 hover:bg-red-700`}>
        Effacer
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}