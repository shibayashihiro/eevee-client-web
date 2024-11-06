import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  hasMore: boolean;
  loadMore: () => void | Promise<void>;
  loader?: React.ReactNode;
};

/**
 * InfiniteScroll component for lazy loading content.
 *
 * usage:
 *
 * ```tsx
 * <InfiniteScroll hasMore={hasMore} loadMore={loadMore} loader={<LoadingSpinner />}>
 *   {items.map((item) => (
 *     <Item key={item.id} item={item} />
 *   ))}
 * </InfiniteScroll>
 * ```
 */
export const InfiniteScroll = ({ children, hasMore, loadMore, loader }: Props) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    await Promise.resolve(loadMore());
  }, [loadMore]);

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio <= 0) return;
        if (isLoading) return;
        if (hasMore) {
          setIsLoading(true);
          handleLoadMore().then(() => {
            setIsLoading(false);
          });
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isLoading]);

  return (
    <>
      {children}
      <div ref={observerRef}>{isLoading && loader}</div>
    </>
  );
};
