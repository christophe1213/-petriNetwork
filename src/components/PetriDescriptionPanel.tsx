import type { PetriNode } from "@/hooks/type";


interface PetriDescriptionPanelProps {
  /** L'ensemble des nodes du graphe (places + transitions) */
  nodes: PetriNode[];
  onDescriptionChange: (nodeId: string, description: string) => void;
}

/**
 * Panneau latéral affiché à droite du canevas : liste toutes les places
 * et transitions du graphe, chacune avec un champ de description éditable.
 * Purement présentationnel — ne connaît rien du reste du state du graphe.
 */
export default function PetriDescriptionPanel({ nodes, onDescriptionChange }: PetriDescriptionPanelProps) {
  const places = nodes.filter(
    (n): n is Extract<PetriNode, { type: 'place' }> => n.type === 'place'
  );
  const transitions = nodes.filter(
    (n): n is Extract<PetriNode, { type: 'transition' }> => n.type === 'transition'
  );

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-gray-200 bg-gray-50 p-4">
      <h2 className="text-sm font-semibold text-gray-700">Descriptions</h2>

      {nodes.length === 0 && (
        <p className="text-sm text-gray-400">
          Ajoutez des places ou des transitions pour éditer leur description.
        </p>
      )}

      {places.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Places</h3>
          {places.map((node) => (
            <DescriptionField
              key={node.id}
              node={node}
              kindLabel="Place"
              badgeClass="bg-blue-100 text-blue-700"
              onDescriptionChange={onDescriptionChange}
            />
          ))}
        </section>
      )}

      {transitions.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Transitions</h3>
          {transitions.map((node) => (
            <DescriptionField
              key={node.id}
              node={node}
              kindLabel="Transition"
              badgeClass="bg-purple-100 text-purple-700"
              onDescriptionChange={onDescriptionChange}
            />
          ))}
        </section>
      )}
    </aside>
  );
}

interface DescriptionFieldProps {
  node: PetriNode;
  kindLabel: string;
  badgeClass: string;
  onDescriptionChange: (nodeId: string, description: string) => void;
}

function DescriptionField({ node, kindLabel, badgeClass, onDescriptionChange }: DescriptionFieldProps) {
  return (
    <div
      className={`rounded-md border bg-white p-2 shadow-sm ${
        node.selected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${badgeClass}`}>
          {kindLabel}
        </span>
        <span className="truncate text-xs font-semibold text-gray-800">{node.data.label}</span>
      </div>

      {/* `key` force le remontage du textarea (non contrôlé) si le node est recréé,
          pour repartir de la bonne valeur sans re-render à chaque frappe. */}
      <textarea
        key={node.id}
        defaultValue={node.data.description ?? ''}
        onBlur={(e) => onDescriptionChange(node.id, e.target.value)}
        placeholder="Description..."
        rows={3}
        className="w-full resize-none rounded border border-gray-300 p-1.5 text-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}