import type { CSSProperties, DragEvent } from 'react';
import type { PetriNodeKind } from '@/hooks/type';


export default function Palette() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: PetriNodeKind) => {
    event.dataTransfer.setData('application/petri-node-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={asideStyle}>
      <h3 style={{ fontSize: 14, marginBottom: 12 }}>Palette</h3>

      <div draggable onDragStart={(e) => onDragStart(e, 'place')} style={itemStyle}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid #222' }} />
        <span>Place</span>
      </div>

      <div draggable onDragStart={(e) => onDragStart(e, 'transition')} style={itemStyle}>
        <div style={{ width: 26, height: 8, background: '#222' }} />
        <span>Transition</span>
      </div>

      <p style={hintStyle}>
        Glisse un élément sur le canvas.<br />
        Tire depuis le bord d'un élément vers un autre pour créer une flèche.<br />
        Double-clic sur une place = +1 jeton, clic droit = −1 jeton.<br />
        Double-clic sur le libellé = renommer.<br />
        Sélectionne puis "Suppr" pour effacer.
      </p>
    </aside>
  );
}

const asideStyle: CSSProperties = {
  width: 180,
  padding: 12,
  borderRight: '1px solid #ddd',
  background: '#fafafa',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: 6,
  background: '#fff',
  cursor: 'grab',
  fontSize: 13,
};

const hintStyle: CSSProperties = {
  fontSize: 11,
  color: '#666',
  marginTop: 16,
  lineHeight: 1.5,
};
