declare module 'react-draggable' {
  import * as React from 'react';
  export interface DraggableProps {
    axis?: 'both' | 'x' | 'y' | 'none';
    handle?: string;
    defaultPosition?: { x: number; y: number };
    position?: { x: number; y: number };
    bounds?: { left?: number; right?: number; top?: number; bottom?: number } | string;
    onStart?: (e: MouseEvent, data: { x: number; y: number }) => void;
    onDrag?: (e: MouseEvent, data: { x: number; y: number }) => void;
    onStop?: (e: MouseEvent, data: { x: number; y: number }) => void;
    children?: React.ReactNode;
  }
  export default class Draggable extends React.Component<DraggableProps> {}
}