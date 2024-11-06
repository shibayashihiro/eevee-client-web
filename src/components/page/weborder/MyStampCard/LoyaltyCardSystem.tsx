import { Flex, Heading, VStack, Text, Box, HStack } from '@chakra-ui/react';

import { dateTimeToDate } from '@/graphql/helper';
import { formatDateToYMDjp } from '@/utils/formatUtils';
import { LoyaltyCardRankMark } from '@/components/ui/LoyaltyCardRankMark';

import { LoyaltyCardSystemFragment } from './LoyaltyCardSystem.fragment.generated';

type Props = {
  loyaltyCardSystem: LoyaltyCardSystemFragment;
};

export const LoyaltyCardSystem = ({ loyaltyCardSystem }: Props) => {
  const {
    loyaltyCard: { cautions, hasRankUp },
  } = loyaltyCardSystem;
  return (
    <VStack align="stretch" direction="column">
      <VStack align="stretch" spacing="40px">
        <About loyaltyCardSystem={loyaltyCardSystem} />
        {hasRankUp && <RankUpSystem loyaltyCardSystem={loyaltyCardSystem} />}
      </VStack>
      {cautions.length > 0 && (
        <VStack align="start" spacing="0px" mt="32px">
          {cautions.map((caution, index) => (
            <Text key={index} className="text-extra-small" color="mono.secondary" whiteSpace="pre-line">
              {caution}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

const About = ({ loyaltyCardSystem }: Props) => {
  const {
    currentRank,
    expiration,
    loyaltyCard: { hasRankUp, pointCondition },
  } = loyaltyCardSystem;
  const systemTitle = hasRankUp ? 'ランク' : 'スタンプカード';
  return (
    <Flex as="section" direction="column">
      <Heading as="h2" fontWeight="bold" size="md">
        {`${systemTitle}について`}
      </Heading>
      <VStack align="start" spacing="24px" py="16px">
        {hasRankUp && (
          <AboutSection title="現在のランク">
            <Text className="bold-small">{currentRank.name}</Text>
          </AboutSection>
        )}
        <AboutSection title={`${systemTitle}の有効期限`}>
          <VStack as="p" align="start" spacing="0px" className="bold-small">
            {expiration.description && <Text as="span">{expiration.description}</Text>}
            {expiration.expiredAt && (
              <Text as="span">{`
              次回のリセットは${formatDateToYMDjp(dateTimeToDate(expiration.expiredAt))}です。`}</Text>
            )}
          </VStack>
        </AboutSection>
        <AboutSection title="スタンプ条件" caution={pointCondition.caution}>
          <Text className="bold-small">{pointCondition.condition}</Text>
        </AboutSection>
      </VStack>
    </Flex>
  );
};

const AboutSection = ({
  title,
  children,
  caution,
}: {
  title: string;
  children: React.ReactNode;
  caution?: string | null;
}) => {
  return (
    <VStack align="stretch" spacing="8px">
      <Heading as="h3" fontWeight="bold" size="xs" color="mono.secondary">
        {title}
      </Heading>
      <Box>{children}</Box>
      {caution && <Text className="text-extra-small">{caution}</Text>}
    </VStack>
  );
};

const RankUpSystem = ({ loyaltyCardSystem: { loyaltyCard } }: Props) => {
  return (
    <VStack as="section" align="stretch" spacing="24px">
      <VStack align="start" spacing="12px">
        <Heading as="h2" fontWeight="bold" size="md">
          ランクの種類とランクアップ条件
        </Heading>
        <Text className="text-extra-small">
          スタンプを貯めるとランクが上がります。ランクに応じて特典が豪華になります。
        </Text>
      </VStack>
      <VStack align="stretch" spacing="24px">
        {loyaltyCard.ranks.map((rank, index) => (
          <RankSection
            key={index}
            rankName={rank.name}
            rankUpCondition={rank.rankUpCondition}
            rankColor={rank.colorRGB}
            benefit={rank.benefit}
            stampCardRewards={rank.stampCardRewards}
          />
        ))}
      </VStack>
    </VStack>
  );
};

const RankSection = ({
  rankName,
  rankUpCondition,
  rankColor,
  benefit,
  stampCardRewards,
}: {
  rankName: string;
  rankUpCondition: string;
  rankColor: string;
  benefit?: string | null;
  stampCardRewards: string[];
}) => {
  return (
    <VStack as="section" align="stretch" spacing="12px">
      <VStack align="stretch" spacing="8px">
        <HStack spacing="8px">
          <LoyaltyCardRankMark color={rankColor} size="md" />
          <Heading as="h3" fontWeight="bold" size="xs">
            {rankName}
          </Heading>
        </HStack>

        <Text className="text-extra-small">{rankUpCondition}</Text>
      </VStack>
      {benefit && <RankBenefit color={rankColor} benefit={benefit} />}
      <RankStampCardRewards color={rankColor} rewards={stampCardRewards} />
    </VStack>
  );
};

const RankBenefit = ({ color, benefit }: { color: string; benefit: string }) => {
  return (
    <VStack as="section" align="stretch" bg={color} color="mono.white" spacing="4px" p="16px" borderRadius="4px">
      <Text as="h4" className="bold-micro">
        ランク特典
      </Text>
      <Text className="bold-extra-small">{benefit}</Text>
    </VStack>
  );
};

const RankStampCardRewards = ({ color, rewards }: { color: string; rewards: string[] }) => {
  return (
    <VStack as="section" align="stretch" bg="mono.backGroundLight" spacing="4px" p="16px" borderRadius="4px">
      <Text as="h4" className="bold-micro">
        スタンプカード特典
      </Text>
      <VStack align="stretch" spacing="4px">
        {rewards.map((reward, index) => (
          <HStack key={index} spacing="8px" align="center">
            <Box bg={color} color="mono.white" py="2px" px="8px" borderRadius="90px" className="bold-micro">
              {index + 1}枚目
            </Box>
            <Text className="bold-extra-small">{reward}</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
