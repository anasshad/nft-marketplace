import React from "react";
import { NFT, directDeployDeterministic } from "@thirdweb-dev/sdk";
import {
  marketplace as marketplace_address,
  nft as nft_address,
} from "../contract_addresses.json";
import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { AspectRatio, Box, Flex, Skeleton, Text } from "@chakra-ui/react";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    marketplace_address,
    "marketplace-v3"
  );
  const { data: directListing, isLoading: loadingDirectListing } =
    useValidDirectListings(marketplace, {
      tokenContract: nft_address,
      tokenId: nft.metadata.id,
    });

  const { data: auctionListing, isLoading: loadingAuctionListing } = useValidEnglishAuctions(marketplace, {
    tokenContract: nft_address,
    tokenId: nft.metadata.id
  })

  return (
    <Flex
      direction={"column"}
      backgroundColor={"#EEE"}
      justifyContent={"center"}
      padding={"20px"}
    >
      <Box borderRadius={"4px"} overflow={"hidden"}>
        <AspectRatio ratio={1}>
          <ThirdwebNftMedia
            metadata={nft.metadata}
            height={"100%"}
            width="100%"
          /></AspectRatio>
      </Box>
      <Text fontSize={"small"} color={"darkgray"}>
        Token ID #{nft.metadata.id}
      </Text>
      <Text fontWeight={"bold"}>{nft.metadata.name}</Text>
      <Box>
        {loadingMarketplace || loadingDirectListing || loadingAuctionListing ? (
          <Skeleton></Skeleton>
        ) : directListing && directListing[0] ? (
          <Box>
            <Flex direction={'column'}>
              <Text fontSize={'small'}>Price</Text>
              <Text fontSize={'small'}>
                {`${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}`}

              </Text>
            </Flex>
          </Box>
        ) : auctionListing && auctionListing[0] ? (
          <Box>
            <Flex direction={'column'}>
              <Text fontSize={'small'}>Minimum Bid</Text>
              <Text fontSize={'small'}>{`${auctionListing[0]?.minimumBidCurrencyValue.displayValue} ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}</Text>
            </Flex>
          </Box>
        ) : (
          <Box>
            <Flex direction="column">
              <Text fontSize={'small'}>Price</Text>
              <Text fontSize={'small'}>Not Listed</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
