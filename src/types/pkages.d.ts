declare module 'react-draggable' {
  import * as React from 'react';

  interface DraggableData {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
  }

  export interface DraggableCoreProps {
    onStart?: (e: MouseEvent | TouchEvent, data: DraggableData) => void;
    onDrag?: (e: MouseEvent | TouchEvent, data: DraggableData) => void;
    onStop?: (e: MouseEvent | TouchEvent, data: DraggableData) => void;
    handle?: string | undefined;
    bounds?: { left?: number; right?: number; top?: number; bottom?: number } | string;
    children?: React.ReactNode;
  }

  export interface DraggableProps extends DraggableCoreProps {
    axis?: 'both' | 'x' | 'y' | 'none';
    defaultPosition?: { x: number; y: number };
    position?: { x: number; y: number };
    scale?: number;
    nodeRef?: React.RefObject<HTMLElement>;
  }

  export default class Draggable extends React.Component<DraggableProps> {}
}
