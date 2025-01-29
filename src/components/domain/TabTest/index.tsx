import { useState, useRef, useEffect, FC } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  Flex,
  Badge,
  Text,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

type Category = {
  name: string;
  subcategories: string[];
  items: Record<string, string[]>;
};

type TabTestProps = {
  categoriesData: {
    name: string;
    items?: {
      nodes?: { name: string }[];
    };
  }[];
};
export const TabTest: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);

  const categories: Category[] = [
    {
      name: "パスタ",
      subcategories: ["OIL", "MEAT", "JAPANESE TASTE", "TOMATO"],
      items: {
        OIL: Array.from({ length: 5 }, (_, i) => `Oil Pasta ${i + 1}`),
        MEAT: Array.from({ length: 5 }, (_, i) => `Meat Pasta ${i + 1}`),
        "JAPANESE TASTE": Array.from(
          { length: 5 },
          (_, i) => `Japanese Pasta ${i + 1}`
        ),
        TOMATO: Array.from({ length: 5 }, (_, i) => `Tomato Pasta ${i + 1}`),
      },
    },
    {
      name: "肉料理",
      subcategories: ["CHICKEN", "BEEF", "PORK"],
      items: {
        CHICKEN: Array.from({ length: 5 }, (_, i) => `Chicken Dish ${i + 1}`),
        BEEF: Array.from({ length: 5 }, (_, i) => `Beef Dish ${i + 1}`),
        PORK: Array.from({ length: 5 }, (_, i) => `Pork Dish ${i + 1}`),
      },
    },
    {
      name: "ドルチェ",
      subcategories: ["CAKE", "ICE CREAM", "PIE"],
      items: {
        CAKE: Array.from({ length: 5 }, (_, i) => `Cake ${i + 1}`),
        "ICE CREAM": Array.from({ length: 5 }, (_, i) => `Ice Cream ${i + 1}`),
        PIE: Array.from({ length: 5 }, (_, i) => `Pie ${i + 1}`),
      },
    },
    {
      name: "パスタ",
      subcategories: ["OIL", "MEAT", "JAPANESE TASTE", "TOMATO"],
      items: {
        OIL: Array.from({ length: 5 }, (_, i) => `Oil Pasta ${i + 1}`),
        MEAT: Array.from({ length: 5 }, (_, i) => `Meat Pasta ${i + 1}`),
        "JAPANESE TASTE": Array.from(
          { length: 5 },
          (_, i) => `Japanese Pasta ${i + 1}`
        ),
        TOMATO: Array.from({ length: 5 }, (_, i) => `Tomato Pasta ${i + 1}`),
      },
    },
    {
      name: "肉料理",
      subcategories: ["CHICKEN", "BEEF", "PORK"],
      items: {
        CHICKEN: Array.from({ length: 5 }, (_, i) => `Chicken Dish ${i + 1}`),
        BEEF: Array.from({ length: 5 }, (_, i) => `Beef Dish ${i + 1}`),
        PORK: Array.from({ length: 5 }, (_, i) => `Pork Dish ${i + 1}`),
      },
    },
  ];

  const subCategoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const categoryTabListRef = useRef<HTMLDivElement | null>(null);
  const subCategoryFlexRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryChange = (index: number) => {
    setSelectedCategory(index);
    setSelectedSubCategory(0);

    const tabs = categoryTabListRef.current?.children[index];
    if (tabs) {
      tabs.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleSubCategoryChange = (index: number) => {
    setSelectedSubCategory(index);

    const badges = subCategoryFlexRef.current?.children[index];
    if (badges) {
      badges.scrollIntoView({ behavior: "smooth", inline: "center" });
    }

    const subcategoryName = categories[selectedCategory].subcategories[index];
    const ref = subCategoryRefs.current[subcategoryName];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;

    categories[selectedCategory].subcategories.forEach((sub, index) => {
      const ref = subCategoryRefs.current[sub];
      if (ref) {
        const rect = ref.getBoundingClientRect();

        if (rect.top >= containerTop && rect.top < containerTop + 200) {
          setSelectedSubCategory(index);

          const badge = subCategoryFlexRef.current?.children[index];
          if (badge) {
            badge.scrollIntoView({ behavior: "smooth", inline: "center" });
          }
        }
      }
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedCategory]);

  return (
    <Box>
    <Box position="sticky" top="0" zIndex="10" bg="white">
        <Box
            overflowX="auto"
            borderBottom="1px solid"
            borderColor="mono.divider"
            whiteSpace="nowrap"
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
            <Tabs index={selectedCategory} onChange={handleCategoryChange}>
            <TabList ref={categoryTabListRef} display="inline-flex" gap={0} pb="0px">
                {categories.map((category, index) => (
                <Tab
                    key={index}
                    bg={selectedCategory === index ? "brand.primary" : "white"}
                    color={selectedCategory === index ? "white" : "mono.primary"}
                    className="bold-small"
                    transition="0.2s"
                    position="relative"
                    px="18px"
                    py="12px"
                    borderBottom="none"
                >
                    {category.name}

                    {selectedCategory === index && (
                    <Box
                        position="absolute"
                        bottom="0"
                        textAlign="center"
                        mt="-4"
                    >
                        <motion.div
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: "6px solid white",
                            margin: "auto",
                        }}
                        />
                    </Box>
                    )}
                </Tab>
                ))}
            </TabList>
            </Tabs>
        </Box>

        <Box
            p="8px"            
            overflowX="auto"
            whiteSpace="nowrap"
            borderBottom="1px solid"
            borderColor="mono.divider"
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
            <Flex ref={subCategoryFlexRef} justify="start" gap="8px">
            {categories[selectedCategory].subcategories.map((sub, i) => (
                <Box
                key={i}
                px="18px"
                py="8px"
                className="bold-small"
                borderRadius="full"
                cursor="pointer"
                bg={i === selectedSubCategory ? "brand.primary" : "mono.backGround"}
                color={i === selectedSubCategory ? "white" : "black"}
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
        mt="4"
        overflowY="auto"
        maxHeight="600px"
        px="4"
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {categories[selectedCategory].subcategories.map((sub, i) => (
            <Box
              key={i}
              ref={(el) => (subCategoryRefs.current[sub] = el)}
              mb="10"
            >
              <Text fontSize="20px" fontWeight="bold" mb="4">
                {sub}
              </Text>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing="6"
              >
                {categories[selectedCategory].items[sub].map((item, j) => (
                  <Box
                    key={j}
                    p="4"
                    height="200px"
                    width="200px"
                    bg="white"
                    shadow="md"
                    borderRadius="10px"
                    border="1px solid lightgray"
                    textAlign="center"
                    _hover={{ shadow: "lg" }}
                  >
                    <Text fontSize="18px" fontWeight="bold">
                      {item}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}
