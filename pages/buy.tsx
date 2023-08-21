import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import NFTGrid from "../components/NFTGrid";
import {
  marketplace as marketplace_address,
  nft as nft_address,
} from "../contract_addresses.json";
import { useContract, useNFTs } from "@thirdweb-dev/react";

export default function Buy() {
  const { contract } = useContract(nft_address);
  const { data, isLoading } = useNFTs(contract);
  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>Buy NFTs</Heading>
      <Text>Browse and buy NFTs from this collection</Text>
      <NFTGrid isLoading={isLoading} data={data} emptyText={"No NFTs found"} />
    </Container>
  );
}
