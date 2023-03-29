import { useState, useEffect } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

export function useBounds(target) {
  const [bounds, setBounds] = useState();

  useEffect(() => {
    setBounds(target.current.getBoundingClientRect())
  }, [target])

  useResizeObserver(target, (entry) => setBounds(entry.contentRect))
  
  return bounds;
}