import { HStack, VStack, Text, Center } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { StampCard } from '@/components/domain/StampCard';
import { useRefMap } from '@/hooks/useRefMap';

import { StampCardsCarouselFragment } from './StampCardsCarousel.fragment.generated';

type Props = {
  loyaltyCard: StampCardsCarouselFragment;
};

export const StampCardsCarousel = ({ loyaltyCard }: Props) => {
  const { currentRank, activeStampCards } = loyaltyCard;

  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { getAllNodes, getNode, handleRefCallback } = useRefMap();

  useEffect(() => {
    const latestCardIndex = activeStampCards.length - 1;
    const node = getNode(`${latestCardIndex}`);
    if (node) {
      node.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [activeStampCards.length, getNode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const nodes = getAllNodes();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentIndex(parseInt(entry.target.getAttribute('data-slide-index') || '0', 10));
          }
        });
      },
      { root: container, threshold: 0.5 },
    );

    nodes.forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, [getAllNodes]);
  return (
    <VStack align="stretch" spacing="24px">
      <HStack ref={containerRef} overflowX="scroll" scrollBehavior="smooth" scrollSnapType="x mandatory">
        {activeStampCards.map((stampCard, index) => (
          <Center
            w="full"
            flexShrink="0"
            key={index}
            ref={handleRefCallback(`${index}`)}
            data-slide-index={index}
            scrollSnapAlign="center"
          >
            <VStack spacing="12px">
              <Text textAlign="center" className="text-extra-small">
                {`${currentRank.name}スタンプカード${index + 1}枚目`}
              </Text>
              <StampCard stampCard={stampCard} stampColor={currentRank.colorRGB} />
            </VStack>
          </Center>
        ))}
      </HStack>
      <CarouselPage currentIndex={currentIndex} length={activeStampCards.length} />
    </VStack>
  );
};

const CarouselPage = ({ currentIndex, length }: { currentIndex: number; length: number }) => {
  return (
    <HStack justifyContent="center" spacing="8px">
      {Array.from({ length }).map((_, index) => (
        <Center
          key={index}
          w="8px"
          h="8px"
          borderRadius="50%"
          bg={currentIndex === index ? 'mono.primary' : 'mono.white'}
          border={currentIndex === index ? 'none' : '1px'}
          borderColor="mono.divider"
        />
      ))}
    </HStack>
  );
};
