import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpringStyle, springs } from '../../hooks/usePhysicsSpring';

interface SpringWrapperProps {
  children: React.ReactElement<any>;
  scaleOnPress?: number;
}

const SpringWrapper: React.FC<SpringWrapperProps> = ({ children, scaleOnPress = 0.95 }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const targetScale = isPressed ? scaleOnPress : (isHovered ? 1.02 : 1);
  
  const ref = useSpringStyle(targetScale, 'transform', (val) => `scale(${val})`, springs.micro);
  
  const childRef = (children as any).ref;
  
  const setRefs = useCallback((node: any) => {
    ref.current = node;
    if (typeof childRef === 'function') {
      childRef(node);
    } else if (childRef) {
      childRef.current = node;
    }
  }, [ref, childRef]);

  const handleMouseDown = useCallback((e: any) => {
    setIsPressed(true);
    if (children.props.onMouseDown) children.props.onMouseDown(e);
  }, [children.props]);

  const handleMouseUp = useCallback((e: any) => {
    setIsPressed(false);
    if (children.props.onMouseUp) children.props.onMouseUp(e);
  }, [children.props]);
  
  const handleMouseLeave = useCallback((e: any) => {
    setIsPressed(false);
    setIsHovered(false);
    if (children.props.onMouseLeave) children.props.onMouseLeave(e);
  }, [children.props]);

  const handleMouseEnter = useCallback((e: any) => {
    setIsHovered(true);
    if (children.props.onMouseEnter) children.props.onMouseEnter(e);
  }, [children.props]);

  return React.cloneElement(children, {
    ref: setRefs,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    style: { ...children.props.style, display: 'inline-block', transformOrigin: 'center' }
  });
};

export default SpringWrapper;
