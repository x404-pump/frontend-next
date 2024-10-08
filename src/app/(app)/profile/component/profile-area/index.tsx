"use client";

import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import copy from "copy-to-clipboard";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";

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
    const { account, connected } = useWallet();

    return (
        <div className="w-fit h-fit flex flex-col gap-4 items-start">
            <h6 className="text-2xl font-semibold text-foreground">Profile</h6>
            <Tooltip
                content={"Collection Address"}
            >
                <Chip
                    color="default"
                    radius="full"
                    className="cursor-pointer"
                    classNames={{
                        base: "py-2 h-fit px-2",
                    }}
                    endContent={
                        <div className="rounded-full p-2 bg-foreground-100">
                            <IoCopy size={16} />
                        </div>}
                    onClick={() => {
                        try {
                            if (!account?.address) return;
                            copy(account.address);
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
                    {truncateAddress(account?.address) || "No address available"}
                </Chip>
            </Tooltip>
            <div className="w-full" />
        </div>
    );
}
export default function Index() {
    const { account, connected } = useWallet();
    
    return (
        <div className="w-full flex flex-col md:flex-row md:items-end gap-8">
            <Profile />
        </div>
    )
}