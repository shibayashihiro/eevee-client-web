import { Box, LinkBox, LinkOverlay, Container, Flex, Image, SimpleGrid, Text, VStack, Link } from '@chakra-ui/react';
import React from 'react';

import { BikeIcon } from '@/components/ui/Icons/BikeIcon';
import { TakeoutIcon } from '@/components/ui/Icons/TakeoutIcon';
import { deliveryAddressSelectPage, shopListPage } from '@/utils/paths/tenantPages';
import { NextLink } from '@/components/ui/NextLink';

import { HomeContainerPromotionEnabledSectionFragment } from './HomeContainerPromotionEnabledSection.fragment.generated';

type Props = {
  bannerSection: HomeContainerPromotionEnabledSectionFragment;
};

export const HomeContainerPromotionEnabled = ({ bannerSection }: Props) => {
  return (
    <Container
      py="24px"
      px={{
        base: '21px',
        md: '0px',
      }}
    >
      <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4} mx="auto" maxW="container.md">
        <LinkBox as="article" bg="brand.primary" borderRadius="lg" w="100%" h="auto" px="8px" py="16px" color="white">
          <Flex direction="column" align="center" justify="center">
            <BikeIcon boxSize="32px" />
            <Text mt="12px" whiteSpace="normal" textAlign="center" className="bold-small">
              <LinkOverlay as={NextLink} href={deliveryAddressSelectPage}>
                宅配・デリバリーで
                <br />
                ご注文
              </LinkOverlay>
            </Text>
          </Flex>
        </LinkBox>

        <LinkBox as="article" bg="brand.primary" borderRadius="lg" w="100%" h="auto" px="8px" py="16px" color="white">
          <Flex direction="column" align="center" justify="center">
            <TakeoutIcon boxSize="32px" />
            <Text mt="12px" whiteSpace="normal" textAlign="center" className="bold-small">
              <LinkOverlay as={NextLink} href={shopListPage}>
                お持ち帰りで
                <br />
                ご注文
              </LinkOverlay>
            </Text>
          </Flex>
        </LinkBox>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={10}>
        {bannerSection?.topPageBannerSections?.bannerSection?.banners?.map((banner, index) => (
          <VStack key={index} spacing={0} borderRadius="md">
            <Link href={banner?.url || '#'} w="100%" isExternal>
              <Image src={banner?.image || ''} alt={banner?.title || ''} w="100%" />
            </Link>
          </VStack>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={10}>
        {bannerSection?.topPageBannerSections?.navigationItemsSection?.banners?.map((banner, index) => (
          <Box
            as="a"
            key={index}
            href={banner?.url || '#'}
            target="_blank"
            w="100%"
            h="68px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            _hover={{
              filter: 'brightness(0.8)',
              transition: 'filter 0.5s ease',
            }}
          >
            <Image src={banner?.image || ''} alt={banner?.title || ''} w="100%" h="100%" objectFit="cover" />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};
