import { Box, IconButton, Text } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';

import { RightArrowIcon } from '../Icons/RightArrowIcon';
import { LoadingSpinner } from '../LoadingSpinner';

type Props = {
  // ボタンのテキスト
  mainText: string;
  // スワイプ完了後に表示するテキスト
  completedText: string;
  // スワイプ済みかどうか
  isSwiped: boolean;
  // スワイプ完了時のコールバック
  onSwiped: () => void;
  // ローディング中かどうか
  isLoading?: boolean;
};

const thresholdRate = 0.8; // スワイプ完了と判定する閾値(0~1)
const iconButtonSize = 48; // スワイプ対象のボタンのサイズ
const initialPosition = 4; // 初期位置（左のマージン考慮）

/**
 * スワイプで動作するボタン
 * ※一応コンポーネントに切り出したが、まだ一箇所でしか使ってないので、利用時はよく検証すること
 */
export const SwipeButton = ({ mainText, completedText, isSwiped, onSwiped, isLoading }: Props) => {
  const [iconButtonPosition, setIconButtonPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwiped: (_) => {
      setIsDragging(false);
      if (isSwiped) {
        return;
      }
      if (!containerRef.current) {
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const threshold = containerWidth * thresholdRate;
      if (iconButtonPosition > threshold) {
        setIconButtonPosition(containerWidth - iconButtonSize - initialPosition);
        onSwiped();
        if (!isSwiped) {
          setIconButtonPosition(initialPosition);
        }
      } else {
        setIconButtonPosition(initialPosition);
      }
    },
    onSwiping: (eventData) => {
      setIsDragging(true);
      if (isSwiped) {
        return;
      }
      if (!containerRef.current) {
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const maxPosition = containerWidth - iconButtonSize - initialPosition; // ボタンの幅 + 右のマージン
      const newPosition = Math.max(initialPosition, Math.min(maxPosition, initialPosition + eventData.deltaX));
      setIconButtonPosition(newPosition);
    },
    preventScrollOnSwipe: true,
    delta: 10,
    trackMouse: true,
  });

  const calculateTextOpacity = () => {
    if (!containerRef.current) {
      return 1;
    }
    const containerWidth = containerRef.current.offsetWidth;
    const progress = (iconButtonPosition - initialPosition) / (containerWidth - iconButtonSize - initialPosition * 2);
    return Math.max(0, 1 - progress);
  };

  const textOpacity = isSwiped ? 1 : calculateTextOpacity();
  return (
    <Box
      ref={containerRef}
      position="relative"
      bg={isSwiped ? 'mono.secondary' : 'brand.primary'}
      color="mono.white"
      rounded="28px"
      px="45px"
      h="56px"
      alignContent="center"
      w="full"
      overflow="hidden"
    >
      {isLoading ? (
        <LoadingSpinner color="mono.white" />
      ) : (
        <MainContent
          mainText={mainText}
          completedText={completedText}
          isSwiped={isSwiped}
          isDragging={isDragging}
          iconButtonPosition={iconButtonPosition}
          handlers={handlers}
          textOpacity={textOpacity}
        />
      )}
    </Box>
  );
};

const MainContent = ({
  mainText,
  completedText,
  isSwiped,
  isDragging,
  iconButtonPosition,
  handlers,
  textOpacity,
}: {
  mainText: string;
  completedText: string;
  isSwiped: boolean;
  isDragging: boolean;
  iconButtonPosition: number;
  handlers: ReturnType<typeof useSwipeable>;
  textOpacity: number;
}) => {
  return (
    <>
      {!isSwiped && (
        <IconButton
          position="absolute"
          left={`${iconButtonPosition}px`}
          isRound={true}
          icon={<RightArrowIcon color="brand.primary" boxSize="16px" />}
          aria-label="スワイプして利用する"
          boxSize={`${iconButtonSize}px`}
          top="50%" // 上下中央に寄せる
          transform="translateY(-50%)" // 上下中央に寄せる
          transition={isDragging ? 'none' : 'left 0.5s'}
          bg="mono.white"
          _active={{ bg: 'mono.white' }}
          _focus={{ bg: 'mono.white' }}
          {...handlers}
        />
      )}
      {!isSwiped && (
        <Box
          position="absolute"
          zIndex={2}
          left={0}
          top={0}
          bottom={0}
          w={`${iconButtonPosition}px`}
          bg="brand.primary"
          transition={isDragging ? 'none' : 'width 0.5s'}
        />
      )}
      <Text zIndex={1} w="full" textAlign="center" fontSize="14px" fontWeight="700" opacity={textOpacity}>
        {isSwiped ? completedText : mainText}
      </Text>
    </>
  );
};
