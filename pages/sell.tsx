import React, { useState } from "react";
import { nft as nft_address, marketplace as marketplace_address } from '../contract_addresses.json'
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { Box, Button, Card, Text, Container, Flex, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import NFTGrid from "../components/NFTGrid";
import SaleInfo from '../components/SaleInfo';

export default function Sell() {
    const { contract } = useContract(nft_address)
    const address = useAddress();
    const { data, isLoading } = useOwnedNFTs(contract, address)
    const [selectedNFT, setSelectedNFT] = useState<NFTType>();
    return (
        <Container maxW={'1200px'} p={5}>
            <Heading>Sell NFT</Heading>
            <Text>Select NFT to sell: </Text>
            {
                !selectedNFT ? (
                    <NFTGrid data={data} isLoading={isLoading} overrideOnClickBehavior={(nft) => {
                        setSelectedNFT(nft);
                    }}
                        emptyText="You do not own any NFT"
                    />
                ) : (
                    <Flex justifyContent={'center'} my={10}>
                        <Card width={'75%'}>
                            <SimpleGrid columns={2} spacing={10} p={5}>
                                <ThirdwebNftMedia metadata={selectedNFT.metadata} width="100%" height="100%" />
                                <Stack>
                                    <Flex justifyContent={'right'}>
                                        <Button onClick={() => setSelectedNFT(undefined)}>X</Button>
                                    </Flex>
                                    <Heading>{selectedNFT.metadata.name}</Heading>
                                    <SaleInfo nft={selectedNFT} />
                                </Stack>
                            </SimpleGrid>
                        </Card>
                    </Flex>
                )
            }
        </Container>
    )
}