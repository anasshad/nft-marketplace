import {
  Avatar,
  Box,
  Container,
  Flex,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text, Link
} from "@chakra-ui/react";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  Web3Button,
  useContract,
  useMinimumNextBid,
  useValidDirectListings,
  useValidEnglishAuctions
} from "@thirdweb-dev/react";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import NextLink from 'next/link'
import { nft as nft_address, marketplace as marketplace_address } from '../../../contract_addresses.json'

type Props = {
  nft: NFT;
  contractMetadata: any;
}

export default function TokenPage({ nft, contractMetadata }: Props) {
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(marketplace_address, 'marketplace-v3')
  const { contract: nftCollection } = useContract(nft_address)
  const { data: directListing, isLoading: loadingDirectListing } = useValidDirectListings(marketplace, {
    tokenContract: nft_address,
    tokenId: nft.metadata.id
  })
  const [bidValue, setBidValue] = useState<string>();
  const { data: auctionListing, isLoading: loadingAuctionListing } = useValidEnglishAuctions(marketplace, {
    tokenContract: nft_address,
    tokenId: nft.metadata.id
  })

  async function buyListing() {
    let txResult;
    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      )
    }
    else if (directListing?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        1
      )
    } else {
      throw new Error('No listing found')
    }
    return txResult
  }

  async function createBidOffer() {
    let txResult;
    if (!bidValue) {
      return;
    }
    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue
      )
    } else {
      throw new Error("No listing found")
    }
    return txResult;
  }

  return (
    <Container maxW={"1200px"} p={5} my={5}>
      <SimpleGrid columns={2} spacing={6}>
        <Stack spacing={'20px'}>
          <Box borderRadius={'6px'} overflow={'hidden'} >
            <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
              <ThirdwebNftMedia metadata={nft.metadata} width="100%" height="100%" />
            </Skeleton>
          </Box>
          <Box>
            <Text fontWeight={'bold'} >Description:</Text>
            <Text  >{nft.metadata.description}</Text>
          </Box>
          <Box>
            <Text fontWeight={'bold'}>Traits:</Text>
            <SimpleGrid columns={2} spacing={4}>
              {
                Object.entries(nft.metadata.attributes || {}).map(
                  ([key, value]) => (
                    <Flex key={key} direction={'column'} alignItems={'center'} justifyContent={'center'} borderWidth={1}>
                      <Text fontSize={'small'}>{value.trait_type}</Text>
                      <Text fontSize={'small'} fontWeight={'bold'}>{value.value}</Text>

                    </Flex>
                  )
                )
              }
            </SimpleGrid>
          </Box>
        </Stack>
        <Stack spacing={'20px'}>
          {contractMetadata && (
            <Flex alignItems={'center'}>
              <Box borderRadius={'4px'} overflow={'hidden'} mr={'10px'}>
                <MediaRenderer
                  src={contractMetadata.image}
                  height="32px"
                  width="32px" />
              </Box>
              <Text fontWeight={'bold'}>{contractMetadata.name}</Text>
            </Flex>
          )}
          <Box mx={2.5}>
            <Text fontSize={'4xl'} fontWeight={'bold'}>{nft.metadata.name}</Text>
            <Link as={NextLink} href={`/profile/${nft.owner}`}>
              <Flex direction={'row'} alignItems={'center'}>
                <Avatar src="https://bit.ly/broken-link" h={'24px'} w={'24px'} mr={2} />
                <Text fontSize={'small'}>{nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</Text>
              </Flex>
            </Link>
          </Box>
          <Stack backgroundColor={'#EEE'} p={2.5} borderRadius={'6px'}>
            <Text color='darkgray'>Price:</Text>
            <Skeleton isLoaded={!loadingDirectListing && !loadingMarketplace}>
              {
                directListing && directListing[0] ? (
                  <Text fontSize={'3xl'} fontWeight={'bold'}>
                    {directListing[0]?.currencyValuePerToken.displayValue}
                    {" " + directListing[0]?.currencyValuePerToken.symbol}
                  </Text>
                ) : auctionListing && auctionListing[0] ? (
                  <Text fontSize={'3xl'} fontWeight={'bold'}>
                    {auctionListing[0].buyoutCurrencyValue.displayValue}
                    {" " + auctionListing[0].buyoutCurrencyValue.symbol}
                  </Text>
                ) : (
                  <Text fontSize={'3xl'} fontWeight={'bold'}>Not for sale</Text>
                )
              }
            </Skeleton>
            <Skeleton isLoaded={!loadingAuctionListing}>
              {
                auctionListing && auctionListing[0] && (
                  <Flex direction={'column'}>
                    <Text color={'darkgray'}>Bids starting from: </Text>
                    <Text fontSize={'3xl'} fontWeight={'bold'}>
                      {auctionListing[0].minimumBidCurrencyValue.displayValue}
                      {" " + auctionListing[0].minimumBidCurrencyValue.symbol}
                    </Text>
                  </Flex>
                )
              }
            </Skeleton>
          </Stack>
          <Skeleton isLoaded={!loadingDirectListing && !loadingMarketplace || !loadingAuctionListing}>
            <Stack spacing={3} >
              <Web3Button contractAddress={marketplace_address} action={async () => buyListing()} isDisabled={!directListing || !directListing[0] || !auctionListing || !auctionListing[0]}>
                Buy at asking price
              </Web3Button>

              <Text textAlign={'center'}>Or</Text>
              <Input mb={5} defaultValue={auctionListing?.[0].minimumBidCurrencyValue.displayValue} type="number" onChange={e => setBidValue(e.target.value)} />
              <Web3Button contractAddress={marketplace_address} action={async () => await createBidOffer()} isDisabled={!auctionListing || !auctionListing[0]}>Place Bid</Web3Button>
            </Stack>
          </Skeleton>

        </Stack>
      </SimpleGrid>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const sdk = new ThirdwebSDK("mumbai", {
    secretKey: "Urfki4R1YeAXTrU-psjKOnZz2l_f_OvFhAIQ2ji9HGyurHLHmnhS41tFv-MpYqsm-aCJ8bitgqzUdS0cfzcXwg"
  });
  const contract = await sdk.getContract(nft_address);
  const nft = await contract.erc721.get(tokenId);
  let contractMetadata;
  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) { }
  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null
    },
    revalidate: 1
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK("mumbai", {
    secretKey: "Urfki4R1YeAXTrU-psjKOnZz2l_f_OvFhAIQ2ji9HGyurHLHmnhS41tFv-MpYqsm-aCJ8bitgqzUdS0cfzcXwg"
  });
  const contract = await sdk.getContract(nft_address);
  const nfts = await contract.erc721.getAll();
  const paths = nfts.map(nft => {
    return {
      params: {
        contractAddress: nft_address,
        tokenId: nft.metadata.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}