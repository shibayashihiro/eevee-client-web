import { HStack, VStack, Text, Badge } from '@chakra-ui/react';

import { isAfter } from '@/utils/date';

import { TableCourseMenuStatsHeaderFragment } from './TableCourseMenuStatsHeader.fragment.generated';
import { LastOrderTimer } from './LastOrderTimer';

type Props = {
  table: TableCourseMenuStatsHeaderFragment;
};

const buildCourseMenuNamesText = (table: TableCourseMenuStatsHeaderFragment) => {
  const names: string[] = [];
  if (table.mainCourseMenu) {
    names.push(table.mainCourseMenu.courseMenu.name);
  }
  const subNames = table.subCourseMenus.map((subCourseMenu) => subCourseMenu.courseMenu.name);
  // 重複を除去
  const uniqueSubNames = [...new Set([...names, ...subNames])];
  return uniqueSubNames.join(', ');
};

export const TableCourseMenuStatsHeader = ({ table }: Props) => {
  if (!table.mainCourseMenu && table.subCourseMenus.length === 0) {
    return null;
  }

  const lastOrderFinished =
    table.mainCourseMenu?.lastOrderAt && isAfter(new Date(), new Date(table.mainCourseMenu?.lastOrderAt));
  return (
    <>
      {/* ご利用中のコースメニューが最終注文時間を過ぎている場合は表示しない */}
      <VStack display={lastOrderFinished ? 'none' : 'flex'} align="stretch" bg="brand.primary" p="12px">
        <HStack alignItems="center" spacing="8.5px">
          <OngoingBadge />
          <Text className="bold-small" color="white" lineHeight="19.6px">
            {buildCourseMenuNamesText(table)}
          </Text>
        </HStack>
        {table.mainCourseMenu && <LastOrderTimer courseMenu={table.mainCourseMenu} />}
      </VStack>
    </>
  );
};

const OngoingBadge = () => {
  return (
    <Badge
      p="1px 2px"
      color="mono.white"
      bg="mono.backGroundLight"
      borderRadius="2px"
      fontSize="12px"
      fontWeight="600"
      lineHeight="16.8px"
    >
      ご利用中
    </Badge>
  );
};
