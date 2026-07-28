import type { CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { TransitionNodeType } from '../hooks/type';

export default function TransitionNode({ data, selected }: NodeProps<TransitionNodeType>) {
  return (
    <div
      style={{
        width: 44,
        height: 12,
        background: '#222',
        border: selected ? '2px solid #1a73e8' : 'none',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Handle id="top" type="source" position={Position.Top} style={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} style={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle} />
      <Handle id="left" type="source" position={Position.Left} style={handleStyle} />

      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          const label = prompt('Nom de la transition :', data.label);
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
const labelStyle: CSSProperties = {
  position: 'absolute',
  top: -22,
  left: -10,
  fontSize: 12,
  whiteSpace: 'nowrap',
  userSelect: 'none',
};
