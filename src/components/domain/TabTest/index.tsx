import { useState, useRef, useEffect, FC, useCallback } from 'react';
import { Box, Tabs, TabList, Tab, Flex, Text, SimpleGrid, Image, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { NoImage } from '@/components/ui/NoImage';
import { safeImage } from '@/utils/image';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';
import { OrderType } from '@/graphql/generated/types';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import FooterNavigation from '../FooterNavigation';
import { CarouselItemPrice } from '../MenuCategoryCarousel/CarouselItemPrice';
import { MenuItemDetailModalContent } from '../MenuItemDetailMoalContent';
import { HomeEatInFacilityInfoSection } from '../HomeFacilityInfoSection/HomeEatInFacilityInfoSection';
import { HomeEatInFacilityInfoSectionFragment, HomeEatInFacilityInfoSectionTableFragment } from '../HomeFacilityInfoSection/HomeEatInFacilityInfoSection.fragment.generated';

type MenuItemType = {
  id: string;
  name: string;
  price: number;
  priceExcludingTax: number;
  image: string;
  status: {
    available: boolean;
    labelUnavailable?: string | null;
    __typename: 'MenuItemStatus';
  };
};

type Category = {
  name: string;
  subcategories: string[];
  items: Record<string, MenuItemType[]>;
};

type TabTestProps = {
  table: HomeEatInFacilityInfoSectionTableFragment | null;
  section: HomeEatInFacilityInfoSectionFragment;
  categoriesData?: {
    id: string;
    name: string;
    subCategories?: {
      name: string;
      items?: {
        nodes?: {
          id: string;
          name: string;
          price: number;
          image: string;
          status: {
            available: boolean;
            labelUnavailable?: string | null;
            __typename: 'MenuItemStatus';
          };
          priceExcludingTax: number;
        }[];
      };
    }[];
  }[];
  orderType: OrderType;
};

export const TabTest: FC<TabTestProps> = ({ section, table, categoriesData = [], orderType }) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);

  categoriesData = [
    {
      id: 'TWVudUNhdGVnb3J5OkJBZzlzaG1BUzRGVDJUR0RmcWpBL0RaNXVtZ0tkdDFXZUFCb0dxUU9I',
      name: 'ハンバーガー',
      subCategories: [
        {
          name: 'Oil',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvc0o0a2czRDRzYW42ZkhnT3dJU0U=',
                name: 'サブオプションテスト用バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvM0VheVU1N0tQanlTTWx5Wm9tTXI=',
                name: '0626バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvNWVsa3dxSjRTWVNqeUtZR0tYZHg=',
                name: 'NEWバーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/f3ab0727-32d3-4caf-be38-df74d10caa29/55e8766d-a267-485a-bf3b-8cf8af1a177f_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Meat',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvNHloWE41dWdielFBMUJYNkptM3Q=',
                name: 'ダブルチーズバーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/acace95a-c4fa-48ce-b1db-47912a400abf/146ae08e-d174-4130-8a7c-07fd1906008a_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvWnRBa0dJSElsazA1c1hESUIzVmU=',
                name: '2023バーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/7bcafd74-7127-44af-b06e-ad0948598911/7cf592bf-8df3-46d0-8c0a-451eb0f36e78_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvYkxsRlBqRG1nQ1VRcFhMOWNwaGk=',
                name: '100円バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvYzN3SDVwT2NxdEtWSDNuQ2xYd20=',
                name: 'テイクアウト500イートイン800バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Tomato',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvY2h3QmhXaUtuY1lacDN2SmxtamI=',
                name: 'テストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvbXNNTW9FbklWd2VDTmlBblRmRG4=',
                name: '新バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvcjE0R3BXYUxvQm9HUEszRnRCSGY=',
                name: 'ほげバーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvc0o0a2czRDRzYW42ZkhnT3dJU0U=',
                name: 'サブオプションテスト用バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvM0VheVU1N0tQanlTTWx5Wm9tTXI=',
                name: '0626バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Cream',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvc0o0a2czRDRzYW42ZkhnT3dJU0U=',
                name: 'サブオプションテスト用バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvM0VheVU1N0tQanlTTWx5Wm9tTXI=',
                name: '0626バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvNWVsa3dxSjRTWVNqeUtZR0tYZHg=',
                name: 'NEWバーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/f3ab0727-32d3-4caf-be38-df74d10caa29/55e8766d-a267-485a-bf3b-8cf8af1a177f_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'JAPANESE TASTE',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvNWVsa3dxSjRTWVNqeUtZR0tYZHg=',
                name: 'NEWバーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/f3ab0727-32d3-4caf-be38-df74d10caa29/55e8766d-a267-485a-bf3b-8cf8af1a177f_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvNHloWE41dWdielFBMUJYNkptM3Q=',
                name: 'ダブルチーズバーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/acace95a-c4fa-48ce-b1db-47912a400abf/146ae08e-d174-4130-8a7c-07fd1906008a_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvWnRBa0dJSElsazA1c1hESUIzVmU=',
                name: '2023バーガー',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/7bcafd74-7127-44af-b06e-ad0948598911/7cf592bf-8df3-46d0-8c0a-451eb0f36e78_780x780.jpeg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvYkxsRlBqRG1nQ1VRcFhMOWNwaGk=',
                name: '100円バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvYzN3SDVwT2NxdEtWSDNuQ2xYd20=',
                name: 'テイクアウト500イートイン800バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvY2h3QmhXaUtuY1lacDN2SmxtamI=',
                name: 'テストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガーテストバーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvbXNNTW9FbklWd2VDTmlBblRmRG4=',
                name: '新バーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvcjE0R3BXYUxvQm9HUEszRnRCSGY=',
                name: 'ほげバーガー',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: 'TWVudUNhdGVnb3J5OkJBZzlzaG1BUzRGVDJUR0RmcWpBL2l0RmpNQ0JESGRnVlh3NG5WT0o1',
      name: 'ピザ',
      subCategories: [
        {
          name: 'JAPANESE TASTE',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvQUtKcHRFeW5vSmlYdE03d1VZY0M=',
                name: 'バジルガーリックチーズ',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/8626d8d2-0938-4867-96b2-ebf6fe77d80e/6ab4b005-5b42-420b-bdfb-6ae0fada19e9_780x780.jpg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Tomato',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvQUtKcHRFeW5vSmlYdE03d1VZY0M=',
                name: 'バジルガーリックチーズ',
                price: 0,
                priceExcludingTax: 0,
                image:
                  'https://image-chompy-dev.imgix.net/8626d8d2-0938-4867-96b2-ebf6fe77d80e/6ab4b005-5b42-420b-bdfb-6ae0fada19e9_780x780.jpg?auto=format&lossless=0&q=65&width=780',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: 'TWVudUNhdGVnb3J5OkJBZzlzaG1BUzRGVDJUR0RmcWpBLzZvR0JHd1pMSlVzeVU0djgxQkZG',
      name: 'デザート',
      subCategories: [
        {
          name: 'tomato',
          items: {
            nodes: [],
          },
        },
      ],
    },
    {
      id: 'TWVudUNhdGVnb3J5OkJBZzlzaG1BUzRGVDJUR0RmcWpBLzRVUzVDekFSQ3FyT2YyQktYdWwz',
      name: 'ドリンク',
      subCategories: [
        {
          name: 'Meat',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvc3dNMzVhZk1SaHZqV3VUVXpVM1g=',
                name: 'つよつよビール',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEveDloaURZMUp2NVM2UUhISndoMTQ=',
                name: 'test',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvSXpiS0JydnZkcU1qWXEycEJ1OHQ=',
                name: 'test2',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvY1J5VENyMWt0ZVh4bVJvR0NsVTE=',
                name: '新規ドリンク入ります',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvTTFLaHZDenZMODV1cUN1U0plUUs=',
                name: '水（無料）',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Oil',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvc3dNMzVhZk1SaHZqV3VUVXpVM1g=',
                name: 'つよつよビール',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEveDloaURZMUp2NVM2UUhISndoMTQ=',
                name: 'test',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Cream',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvSXpiS0JydnZkcU1qWXEycEJ1OHQ=',
                name: 'test2',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvY1J5VENyMWt0ZVh4bVJvR0NsVTE=',
                name: '新規ドリンク入ります',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvTTFLaHZDenZMODV1cUN1U0plUUs=',
                name: '水（無料）',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: 'TWVudUNhdGVnb3J5OkJBZzlzaG1BUzRGVDJUR0RmcWpBL1FaUUViSmk2c29maGVzTVRzUmZn',
      name: 'サラダ',
      subCategories: [
        {
          name: 'Meat',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvcHlJZTVVNEVLU1JQbUJCSFhEeXA=',
                name: '1日分の丸ごとサラダ',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
        {
          name: 'Cream',
          items: {
            nodes: [
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvcHlJZTVVNEVLU1JQbUJCSFhEeXA=',
                name: '1日分の丸ごとサラダ',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
              {
                id: 'TWVudUl0ZW06QkFnOXNobUFTNEZUMlRHRGZxakEvcHlJZTVVNEVLU1JQbUJCSFhEeXA=',
                name: '1日分の丸ごとサラダ',
                price: 0,
                priceExcludingTax: 0,
                image: 'https://storage.googleapis.com/chompy-jp.appspot.com/default/img_placeholder_eevee_780x780.png',
                status: {
                  available: true,
                  labelUnavailable: null,
                  __typename: 'MenuItemStatus',
                },
              },
            ],
          },
        },
      ],
    },
  ];
  const categories: Category[] = categoriesData.map((category) => ({
    name: category.name,
    subcategories: category.subCategories?.map((sub) => sub.name) || [],
    items:
      category.subCategories?.reduce(
        (acc, sub) => {
          acc[sub.name] = sub.items?.nodes || [];
          return acc;
        },
        {} as Record<string, MenuItemType[]>,
      ) || {},
  }));
  const { showPriceExcludingTax } = useFeatureFlags();
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const subCategoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const categoryTabListRef = useRef<HTMLDivElement | null>(null);
  const subCategoryFlexRef = useRef<HTMLDivElement | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const [isManualScrolling, setIsManualScrolling] = useState<boolean>(true);

  const handleScroll = useCallback(() => {
    if (!screenRef.current || isProgrammaticScroll.current) return;

    const container = screenRef.current;
    const containerMiddle = container.getBoundingClientRect().top + container.clientHeight / 3;
    let newIndex = selectedSubCategory;

    categories[selectedCategory].subcategories.forEach((sub, index) => {
      const ref = subCategoryRefs.current[sub];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (rect.top <= containerMiddle && rect.bottom > containerMiddle) {
          newIndex = index;
        }
      }
    });

    if (newIndex !== selectedSubCategory) {
      requestAnimationFrame(() => {
        setSelectedSubCategory(newIndex);
      });

      const badge = subCategoryFlexRef.current?.children[newIndex];
      const parent = subCategoryFlexRef.current;

      if (badge && parent) {
        const badgeRect = badge.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        if (badgeRect.left < parentRect.left || badgeRect.right > parentRect.right) {
          requestAnimationFrame(() => {
            badge.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });
          });
        }
      }
    }
  }, [categories, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    const badge = subCategoryFlexRef.current?.children[selectedSubCategory];
    if (badge) {
      badge.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedSubCategory]);

  const handleManualScroll = () => {
    if (!isProgrammaticScroll.current) {
      setIsManualScrolling(true);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const debouncedScroll = debounce(handleScroll, 100);

    container.addEventListener('scroll', debouncedScroll);
    container.addEventListener('touchstart', handleManualScroll);
    container.addEventListener('mousedown', handleManualScroll);
    container.addEventListener('wheel', handleManualScroll);

    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      container.removeEventListener('touchstart', handleManualScroll);
      container.removeEventListener('mousedown', handleManualScroll);
      container.removeEventListener('wheel', handleManualScroll);
    };
  }, [handleScroll]);

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    }) as T;
  };

  useEffect(() => {
    const container = screenRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  useEffect(() => {
    if (!categories[selectedCategory]) return;

    categories[selectedCategory].subcategories.forEach((sub) => {
      subCategoryRefs.current[sub] = document.getElementById(`sub-${sub}`);
    });
  }, [categories, selectedCategory]);
  if (categories.length === 0) {
    return <Text>No Categories Available</Text>;
  }
  const leftText = selectedCategory > 0 ? categories[selectedCategory - 1]?.name : categories[0]?.name || '';

  const rightText =
    selectedCategory < categories.length - 1
      ? categories[selectedCategory + 1]?.name
      : categories[categories.length - 1]?.name || '';

  const handleCategoryChange = (index: number) => {
    setSelectedCategory(index);
    setSelectedSubCategory(0);

    const tabs = categoryTabListRef.current?.children[index];
    if (tabs) {
      tabs.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };
  const handleSubCategoryChange = (index: number) => {
    setIsManualScrolling(false);
    isProgrammaticScroll.current = true;
    setSelectedSubCategory(index);

    const subcategoryName = categories[selectedCategory]?.subcategories[index];
    if (!subcategoryName) return;

    const badges = subCategoryFlexRef.current?.children[index];
    if (badges) {
      badges.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    const ref = subCategoryRefs.current[subcategoryName];
    const container = screenRef.current;

    if (ref && container) {
      setTimeout(() => {
        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const tabHeight = categoryTabListRef.current?.offsetHeight || 50;
        const additionalOffset = 120;

        container.scrollTo({
          top: container.scrollTop + rect.top - containerRect.top - tabHeight - additionalOffset,
          behavior: 'smooth',
        });

        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 500);
      }, 200);
    }
  };

  const handleRightClick = () => {
    setSelectedCategory((prev) => {
      const nextIndex = Math.min(prev + 1, categories.length - 1);

      const tabs = categoryTabListRef.current?.children[nextIndex];
      if (tabs) {
        tabs.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
      return nextIndex;
    });
  };
  const handleLeftClick = () => {
    setSelectedCategory((prev) => {
      const prevIndex = Math.max(prev - 1, 0);

      const tabs = categoryTabListRef.current?.children[prevIndex];
      if (tabs) {
        tabs.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
      return prevIndex;
    });
  };
  const openItemModal = (menuItem: MenuItemType) => {
    setSelectedItem(menuItem);
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <Box height="100vh" ref={screenRef} overflowX="hidden" overflowY="auto" position="relative" pb="74px">
      <VStack
        zIndex="9"
        position="sticky"
        top="0"
        left="0"
        p="12px"
        w="full"
        align="stretch"
        background="white"
        borderBottom="1px solid"
        borderColor="mono.divider"
      >
        <HomeEatInFacilityInfoSection section={section} table={table} />
      </VStack>
      <Box
        position={isManualScrolling ? 'sticky' : 'fixed'}
        top={isManualScrolling ? '0' : undefined}
        left="0"
        zIndex="10"
        width="100vw"
        overflowX="auto"
        sx={{ '&::-webkit-scrollbar': { display: 'none' } }}
      >
        <Box overflowX="auto" whiteSpace="nowrap" bg="white">
          <Box overflowX="auto" borderBottom="1px solid" borderColor="mono.divider">
            <Box overflowX="auto" whiteSpace="nowrap" sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
              <Tabs index={selectedCategory} onChange={handleCategoryChange}>
                <TabList
                  ref={categoryTabListRef}
                  display="inline-flex"
                  pb="0px"
                  border="0px"
                  gap="0"
                  overflowX="auto"
                  whiteSpace="nowrap"
                  sx={{
                    '&::-webkit-scrollbar': { display: 'none' },
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {categories.map((category, index) => (
                    <Tab
                      key={index}
                      bg={selectedCategory === index ? 'brand.primary' : 'white'}
                      color={selectedCategory === index ? 'white' : 'mono.primary'}
                      transition="0.2s"
                      px="18px"
                      py="12px"
                      borderBottom="none"
                    >
                      {category.name}
                      {selectedCategory === index && (
                        <Box position="absolute" bottom="0" textAlign="center" mt="-4">
                          <motion.div
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderBottom: '6px solid white',
                              margin: 'auto',
                            }}
                          />
                        </Box>
                      )}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </Box>
          </Box>
        </Box>

        <Box
          top="48px"
          zIndex="80"
          bg="white"
          p="8px 4px 8px 0px"
          m="0px 4px 0px 5px"
          overflowX="auto"
          whiteSpace="nowrap"
          borderBottom="1px solid"
          borderColor="mono.divider"
          sx={{ '&::-webkit-scrollbar': { display: 'none' } }}
        >
          <Flex ref={subCategoryFlexRef} justify="start" gap="8px">
            {categories[selectedCategory].subcategories.map((sub, i) => (
              <Box
                key={i}
                px="18px"
                py="8px"
                borderRadius="full"
                cursor="pointer"
                bg={i === selectedSubCategory ? 'brand.primary' : 'mono.backGround'}
                color={i === selectedSubCategory ? 'white' : 'black'}
                flexShrink={0}
                onClick={() => handleSubCategoryChange(i)}
              >
                {sub}
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
      <Box
        ref={containerRef}
        sx={{ position: 'relative', height: '100%', marginTop: !isManualScrolling && '100px', zIndex: '8' }}
      >
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {categories[selectedCategory].subcategories.map((sub, i) => (
            <Box key={i} id={`sub-${sub}`} p="20px">
              <VStack spacing="30px" align="stretch">
                <Text className="bold-large">{sub}</Text>
                <SimpleGrid mt="9px" columns={2} spacing="15px">
                  {categories[selectedCategory].items[sub].map((item, j) => (
                    <Box key={j} onClick={() => openItemModal(item)}>
                      <Image
                        src={safeImage(item.image)}
                        alt={item.name}
                        boxSize={{ base: '160px', md: '272px' }}
                        fallback={<NoImage rounded="4px" boxSize={{ base: '160px', md: '272px' }} />}
                        rounded="4px"
                        objectFit="cover"
                      />
                      <Text mt="8px" className="bold-small">
                        {item.name}
                      </Text>
                      <Box mt="4px">
                        <CarouselItemPrice
                          price={item.price}
                          priceExcludingTax={showPriceExcludingTax ? item.priceExcludingTax : undefined}
                          unavailableReason={item.status.available ? null : item.status.labelUnavailable}
                        />
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>
          ))}
        </motion.div>
        <FooterNavigation
          leftText={leftText}
          rightText={rightText}
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
        />
      </Box>

      <SwipeableBottomModal
        isOpen={isItemModalOpen && !!selectedItem?.id}
        onClose={closeItemModal}
        title={selectedItem?.name || ''}
        footer={null}
      >
        {selectedItem?.id && (
          <MenuItemDetailModalContent menuItemId={selectedItem.id} orderType={orderType} closeModal={closeItemModal} />
        )}
      </SwipeableBottomModal>
    </Box>
  );
};
