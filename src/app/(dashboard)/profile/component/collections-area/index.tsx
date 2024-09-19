import { CollectionCard } from "@/app/(dashboard)/dashboard/components/collections-section/CollectionsContainer";
import { ResponsiveContainer } from "@/components/ui";
import { USING_MOCK } from "@/config/contants";
import { mockCollections } from "@/mock";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Index() {
    const { account } = useWallet();
    let collections;
    if (USING_MOCK) {
        collections = mockCollections;
    }

    return (
        <ResponsiveContainer>
            {
                collections && collections.map((collection) => (
                    <CollectionCard key={collection.collection_id} collection={collection} />
                ))
            }
        </ResponsiveContainer>
    )
}