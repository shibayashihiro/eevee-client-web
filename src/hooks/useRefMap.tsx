import { useCallback, useRef } from 'react';

/**
 * refをMapで管理するための仕組みを提供するhooks
 * 数が決まっていない要素のrefを管理したい時などに使う
 *
 * 参考: https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
 *
 * @example
 * const { getNode, handleRefCallback } = useRefMap<HTMLDivElement>();
 *
 * <div ref={handleRefCallback('key1')} />
 * <div ref={handleRefCallback('key2')} />
 * <div ref={handleRefCallback('key3')} />
 *
 * getNode('key1'); // => HTMLDivElement
 * getNode('key2'); // => HTMLDivElement
 * getNode('key3'); // => HTMLDivElement
 *
 */
export function useRefMap<T extends HTMLElement>() {
  const ref = useRef<Map<string, T> | null>(null);

  const getMap = useCallback(() => {
    if (!ref.current) {
      ref.current = new Map<string, T>();
    }
    return ref.current;
  }, []);

  const handleRefCallback = useCallback(
    (key: string) => {
      return (node: T | null) => {
        const map = getMap();
        if (node) {
          map.set(key, node);
        } else {
          map.delete(key);
        }
      };
    },
    [getMap],
  );

  const getNode = useCallback(
    (key: string) => {
      const map = getMap();
      return map.get(key);
    },
    [getMap],
  );

  const getAllNodes = useCallback(() => {
    const map = getMap();
    return Array.from(map.values());
  }, [getMap]);

  return {
    getNode,
    getAllNodes,
    handleRefCallback,
  };
}
