import { useRouter } from "next/router"
import type { NFT as NFTType } from "@thirdweb-dev/sdk"
import { useForm } from 'react-hook-form'
import { nft as nft_address, marketplace as marketplace_address } from '../contract_addresses.json'
import { Web3Button, useContract, useCreateDirectListing } from "@thirdweb-dev/react"
import { Box, Input, Stack, Text } from "@chakra-ui/react"


type Props = {
    nft: NFTType
}

type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
}

export default function SaleInfo({ nft }: Props) {
    const router = useRouter();
    const { contract: marketplace } = useContract(marketplace_address, 'marketplace-v3')
    const { contract: nftCollection } = useContract(nft_address)
    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace)

    async function checkAndProvideApproval() {
        const hasApproval = await nftCollection?.call(
            "isApprovedForAll",
            [nft.owner,
                marketplace_address]
        );

        if (!hasApproval) {
            const txResult = await nftCollection?.call(
                "setApprovalForAll",
                [marketplace_address,
                    true]
            );

            if (txResult) {
                console.log("Approval provided");
            }
        }

        return true;
    }

    const { register: registerDirect, handleSubmit: handleSubmitDirect } = useForm<DirectFormData>({
        defaultValues: {
            nftContractAddress: nft_address,
            tokenId: nft.metadata.id,
            price: "0",
            startDate: new Date(),
            endDate: new Date(),
        },
    })

    async function handleSubmissionDirect(data: DirectFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
            startTimestamp: new Date(data.startDate),
            endTimestamp: new Date(data.endDate),
        });

        return txResult;
    }

    return (
        <Stack spacing={8}>
            <Box>
                <Text fontWeight={'bold'} mb={2}>Direct Listing:</Text>
                <Text>Listing starts on:</Text>
                <Input placeholder="Select date and time" size={'md'} type="datetime-local" {...registerDirect("startDate")} />
                <Text>Listing ends on:</Text>
                <Input placeholder="Select date and time" size={'md'} type="datetime-local" {...registerDirect("endDate")} />
            </Box>
            <Box>
                <Text fontWeight={'bold'}>Price:</Text>
                <Input placeholder="0" size={'md'} type="number" {...registerDirect("price")} />
            </Box>
            <Web3Button
                contractAddress={marketplace_address}
                action={async () => { await handleSubmitDirect(handleSubmissionDirect)() }}
                onSuccess={(txResult) => {
                    router.push(`/token/${nft_address}/${nft.metadata.id}`);
                }}
            >Create Listing</Web3Button>
        </Stack>
    )
}