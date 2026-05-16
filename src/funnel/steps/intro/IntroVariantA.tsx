"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { EVENTS, track } from "@/funnel/analytics/track";

export function IntroVariantA() {
  const { goNext } = useFunnelNavigation();

  const handleStart = () => {
    track(EVENTS.STEP_EXIT, { step_id: "intro", variant: "variant-a" });
    goNext();
  };

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
        <Text
          fontFamily="body"
          fontSize="xs"
          fontWeight="700"
          color="brand.primary"
          letterSpacing="widest"
          textTransform="uppercase"
          mb={4}
        >
          Your personalised plan
        </Text>

        <Heading
          as="h1"
          fontFamily="heading"
          color="fg.default"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          mb={4}
          lineHeight="1.15"
        >
          Build the mind you want.
        </Heading>

        <Text
          fontFamily="body"
          color="fg.muted"
          fontSize="md"
          fontWeight="500"
          lineHeight="1.6"
          mb={8}
        >
          In 5 minutes, we'll create a mindfulness plan tailored to your goal,
          your pace, and where you are right now.
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
          onClick={handleStart}
        >
          Build my plan
        </Button>

        <Text fontFamily="body" fontSize="xs" color="fg.muted" mt={3}>
          Free to start · Takes 5 minutes
        </Text>
      </Box>
    </Box>
  );
}
