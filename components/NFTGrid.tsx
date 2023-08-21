import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { SimpleGrid, Skeleton, Text, Link } from "@chakra-ui/react";
import NFT from "./NFT";
import NextLink from "next/link";
import {
  marketplace as marketplace_address,
  nft as nft_address,
} from "../contract_addresses.json";

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnClickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  isLoading,
  data,
  overrideOnClickBehavior,
  emptyText = "No NFTs Found",
}: Props) {
  return (
    <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <Skeleton key={index} height={"312px"} width={"100%"}></Skeleton>
        ))
      ) : data && data.length > 0 ? (
        data.map((nft) =>
          !overrideOnClickBehavior ? (
            <Link
              href={`/token/${nft_address}/${nft.metadata.id}`}
              key={nft.metadata.id}
            >
              <NFT nft={nft} />
            </Link>
          ) : (
            <div
              key={nft.metadata.id}
              onClick={() => overrideOnClickBehavior(nft)}
            >
              <NFT nft={nft} />
            </div>
          )
        )
      ) : (
        <Text>{emptyText}</Text>
      )}
    </SimpleGrid>
  );
}
