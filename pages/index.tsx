import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { Container, Heading, Flex, Stack, Button, SimpleGrid, Text, Skeleton } from "@chakra-ui/react";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Container maxW={"1200px"}>
      <SimpleGrid columns={2} >
        <Stack spacing={4}>
          <Heading>Discover, and collect Digital Art  NFTs </Heading>
          <Text>Digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, Sell, and discover exclusive digital assets.</Text>
          <Button as={NextLink} href={"/buy"}>
            Shop NFTs
          </Button>
        </Stack>
        <Heading>Hello</Heading>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
