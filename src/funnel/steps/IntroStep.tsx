"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

export function IntroStep() {
  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box maxW="sm" w="full" textAlign="center">
        <Heading
          as="h1"
          fontFamily="heading"
          color="fg.default"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          mb={4}
        >
          Where thoughts become clarity.
        </Heading>

        <Text
          fontFamily="body"
          color="fg.muted"
          fontSize="md"
          fontWeight="600"
          lineHeight="1.6"
          mb={8}
        >
          Answer a few questions so we can personalise your Aurema growth plan.
        </Text>

        <Button
          bg="brand.primary"
          color="bg.canvas"
          fontFamily="body"
          fontWeight="700"
          size="lg"
          w="full"
          borderRadius="xl"
          _hover={{ opacity: 0.9 }}
        >
          Get started
        </Button>
      </Box>
    </Box>
  );
}
