"use client";

import { Button } from "@chakra-ui/react";

type ContinueButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export function ContinueButton({
  onClick,
  disabled = false,
  children = "Continue",
}: ContinueButtonProps) {
  return (
    <Button
      bg="brand.primary"
      color="bg.canvas"
      fontFamily="body"
      fontWeight="700"
      size="lg"
      w="full"
      borderRadius="xl"
      disabled={disabled}
      onClick={onClick}
      _hover={{ opacity: 0.9 }}
      _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
    >
      {children}
    </Button>
  );
}
