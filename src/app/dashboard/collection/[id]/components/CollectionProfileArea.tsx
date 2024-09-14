'use client';

import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { Tooltip } from "@nextui-org/tooltip";
import { Image } from "@nextui-org/image";
import { Award02Icon, CheckmarkBadge01Icon, StartUp02Icon, Tag01Icon, UserShield02Icon } from "hugeicons-react";
import { Chip } from "@nextui-org/chip";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";

import { useCollection } from "../context/collection";
import MintToken from "./MintToken";
import { Divider } from "@nextui-org/divider";
import React from "react";

function Field({ label, value, icon }: { label?: string; value?: string, icon?: any }) {
    return (
        <Tooltip
            classNames={{
                base: "flex flex-row gap-2 items-center",
            }}
            content={label}
        >
            <Chip
                color="default"
                radius="full"
                variant="light"
                className="cursor-pointer opacity-75 hover:opacity-100 transition-opacity duration-200 ease-in-out"
                startContent={icon}

            >
                {value || "-"}
            </Chip>
        </Tooltip>
    );
};

function Profile() {
    const collection = useCollection();

    return (
        <div className="w-fit h-fit flex flex-col gap-4 items-start">
            <Image
                src={collection.collection_image}
                alt={collection.collection_name}
                radius="full"
                classNames={{
                    wrapper: "object-cover aspect-square w-16 md:w-32",
                }}
                isLoading={!collection.collection_image}
                fallbackSrc="https://via.placeholder.com/500x500"
                loading="lazy"
            />
            <h1 className="flex flex-row gap-2 items-center justify-start">
                <span className="text-2xl font-bold text-foreground-900 text-center md:text-start">{collection.collection_name}</span>
                <span><CheckmarkBadge01Icon className="text-success" size={24} /></span>
            </h1>
            <Tooltip
                content={collection.collection_address}
            >
                <Chip
                    color="secondary"
                    radius="full"
                    className="cursor-pointer"
                    endContent={<IoCopy />}
                    onClick={() => {
                        try {
                            if (!collection.collection_address) return;
                            copy(collection.collection_address);
                            toast.success("Copied to clipboard", {
                                type: "success",
                            });
                        } catch (error) {
                            toast.error("Failed to copy to clipboard", {
                                type: "error",
                            });
                        }
                    }}
                >
                    {truncateAddress(collection.collection_address?.toString())}
                </Chip>
            </Tooltip>
            <div className="w-full">
                <p className="text-sm md:text-base text-foreground-800 w-full break-words text-start">{collection.collection_description || "No description available"}</p>
            </div>
        </div>
    );
}

function Details() {
    const collection = useCollection();

    const details = [
        {
            label: "Floor Price",
            value: "-",
            icon: <StartUp02Icon className="text-foreground-700" size={24} />,
        },
        {
            label: "Listings",
            value: "-",
            icon: <Tag01Icon className="text-foreground-700" size={24} />,
        },
        {
            label: "Top Bid",
            value: "-",
            icon: <Award02Icon className="text-foreground-700" size={24} />
        },
        {
            label: "Owners",
            value: "-",
            icon: <UserShield02Icon className="text-foreground-700" size={24} />
        }
    ]

    return (
        <div className="w-full md:w-fit h-fit flex flex-row justify-between md:justify-end md:gap-4 items-center">
            {details.map((detail, index) => (
                <React.Fragment key={index}>
                    <Field
                        label={detail.label}
                        value={detail.value}
                        icon={detail.icon}
                    />
                    {index < details.length - 1 && <Divider orientation="vertical" className="w-1 rounded-full h-4" />}
                </React.Fragment>
            ))}
        </div>
    );
}
function Tools() {
    return (
        <div className="flex flex-row gap-4 items-center md:items-end w-full md:w-fit">
            <MintToken />
        </div>
    );
}
export function CollectionProfileArea() {
    return (
        <div className="bg-foreground-50 rounded-3xl p-8 w-full flex flex-col md:flex-row items-center md:items-end gap-8">
            <Profile />
            <div className="w-full flex flex-col gap-4 items-end">
                <Tools />
                <Details />
            </div>
        </div>
    );
}