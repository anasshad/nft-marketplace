import { Container, Heading, Text } from "@chakra-ui/react";
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import React from "react";
import { nft as nft_address, marketplace as marketplace_address } from "../../contract_addresses.json";
import { useRouter } from "next/router";
import NFTGrid from "../../components/NFTGrid";

export default function ProfilePage() {
    const router = useRouter();
    const { contract: nftCollection } = useContract(nft_address);

    const { contract: marketplace } = useContract(marketplace_address, "marketplace-v3");

    const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
        nftCollection,
        router.query.address as string
    );
    console.log(ownedNfts);
    return (
        <Container maxW={"1200px"} p={5}>
            <Heading>{"Owned NFT(s)"}</Heading>
            <Text>Browse and manage your NFTs from this collection.</Text>
            <NFTGrid
                data={ownedNfts}
                isLoading={loadingOwnedNfts}
                emptyText={"You don't own any NFTs yet from this collection."}
            />
        </Container>
    )
}