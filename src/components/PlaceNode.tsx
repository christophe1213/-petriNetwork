import type { CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { PlaceNodeType } from '../hooks/type';

/** Seuil au-delà duquel on affiche un nombre plutôt que des pastilles individuelles */
const MAX_DOTS = 4;

/** Positions (offsets en px depuis le centre) des pastilles pour 1 à 4 jetons */
function getDotOffsets(count: number): { x: number; y: number }[] {
  switch (count) {
    case 1:
      return [{ x: 0, y: 0 }];
    case 2:
      return [
        { x: -7, y: 0 },
        { x: 7, y: 0 },
      ];
    case 3:
      return [
        { x: 0, y: -7 },
        { x: -7, y: 6 },
        { x: 7, y: 6 },
      ];
    case 4:
      return [
        { x: -7, y: -7 },
        { x: 7, y: -7 },
        { x: -7, y: 7 },
        { x: 7, y: 7 },
      ];
    default:
      return [];
  }
}

export default function PlaceNode({ data, selected }: NodeProps<PlaceNodeType>) {
  const tokens = data.tokens ?? 0;
  const showDots = tokens > 0 && tokens <= MAX_DOTS;
  const showCount = tokens > MAX_DOTS;

  return (
    <div
      onDoubleClick={() => data.onAddToken?.()}
      onContextMenu={(e) => {
        e.preventDefault();
        data.onRemoveToken?.();
      }}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: selected ? '3px solid #1a73e8' : '2px solid #222',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    >
      <Handle id="top" type="source" position={Position.Top} style={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} style={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle} />
      <Handle id="left" type="source" position={Position.Left} style={handleStyle} />

      {showDots && (
        <div style={dotsContainerStyle}>
          {getDotOffsets(tokens).map((offset, i) => (
            <div
              key={i}
              style={{
                ...dotStyle,
                position: 'absolute',
                left: `calc(50% + ${offset.x}px - 5px)`,
                top: `calc(50% + ${offset.y}px - 5px)`,
              }}
            />
          ))}
        </div>
      )}
      {showCount && <span style={{ fontSize: 14, fontWeight: 600 }}>{tokens}</span>}

      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          const label = prompt('Nom de la place :', data.label);
          if (label) data.onRename?.(label);
        }}
        style={labelStyle}
      >
        {data.label}
      </div>
    </div>
  );
}

const handleStyle: CSSProperties = { width: 8, height: 8, background: '#555' };
const dotsContainerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
};
const dotStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: '#222',
};
const labelStyle: CSSProperties = {
  position: 'absolute',
  top: -22,
  left:40,
  fontSize: 12,
  whiteSpace: 'nowrap',
  userSelect: 'none',
};