import axios from "axios";
import { checkIfFund, uploadFolder } from "./irys";
import { IrysGateway } from "@/config/contants";

const VALID_MEDIA_EXTENSIONS = ["png", "jpg", "jpeg", "gltf"];

export type CollectionMetadata = {
  name: string;
  description: string;
  uri: string;
  fa_icon: string;
  fa_symbol: string;
  supply: number;
  image: string;
};
type ImageAttribute = {
  trait_type: string;
  value: string;
};
type ImageMetadata = {
  name: string;
  description: string;
  image: string;
  uri: string;
  attributes: ImageAttribute[];
};

export const checkCollectionData = (files: FileList): boolean => {
  // Convert FileList type into a File[] type
  const filesArray: File[] = [];

  for (let i = 0; i < files.length; i++) {
    filesArray.push(files[i]);
  }

  const collectionFiles = filesArray.filter((file) => file.name.includes("collection"));

  if (collectionFiles.length !== 2) {
    return false;
  }

  // Check collection.json file exists
  const collectionMetadata = collectionFiles.find((file) => file.name === "collection.json");

  if (!collectionMetadata) {
    return false;
  }

  const collectionCover = collectionFiles.find((file) =>
    VALID_MEDIA_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)),
  );

  if (!collectionCover) {
    return false;
  }

  const mediaExt = collectionCover?.name.split(".").pop();

  if (!collectionCover) {
    return false;
  }

  // Check nft metadata json files exist
  const nftImageMetadatas = filesArray.filter((file) => file.name.endsWith("json") && file.name !== "collection.json");

  if (nftImageMetadatas.length === 0) {
    return false;
  }

  // Check NFT image files exist
  const imageFiles = filesArray.filter((file) => file.name.endsWith(`.${mediaExt}`) && file.name !== collectionCover.name);

  if (imageFiles.length === 0) {
    return false;
  }

  // Check nft metadata json files amount is the same as the nft image files
  if (nftImageMetadatas.length !== imageFiles.length) {
    return false;
  }

  return true;
}

export const getCollectionFromFiles = async (
  fileList: FileList,
): Promise<{
  collectionMetadata: CollectionMetadata;
  collectionCover: File;
  nftImageMetadatas: File[];
  imageFiles: File[];
}> => {
  // Convert FileList type into a File[] type
  const files: File[] = [];

  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  const collectionFiles = files.filter((file) => file.name.includes("collection"));

  if (collectionFiles.length !== 2) {
    throw new Error("Please make sure you include both collection.json and collection image file");
  }

  // Check collection.json file exists
  const collectionMetadataFile = collectionFiles.find((file) => file.name === "collection.json");

  if (!collectionMetadataFile) {
    throw new Error("Collection metadata not found, please make sure you include collection.json file");
  }

  const collectionCover = collectionFiles.find((file) =>
    VALID_MEDIA_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)),
  );

  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  const mediaExt = collectionCover?.name.split(".").pop();

  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  // Check nft metadata json files exist
  const nftImageMetadatas = files.filter((file) => file.name.endsWith("json") && file.name !== "collection.json");

  if (nftImageMetadatas.length === 0) {
    throw new Error("Image metadata not found, please make sure you include the NFT json files");
  }

  // Check NFT image files exist
  const imageFiles = files.filter((file) => file.name.endsWith(`.${mediaExt}`) && file.name !== collectionCover.name);

  if (imageFiles.length === 0) {
    throw new Error("Image files not found, please make sure you include the NFT image files");
  }

  // Check nft metadata json files amount is the same as the nft image files
  if (nftImageMetadatas.length !== imageFiles.length) {
    throw new Error("Mismatch between NFT metadata json files and images files");
  }

  const collectionMetadata: CollectionMetadata = JSON.parse(await collectionMetadataFile.text());

  return {
    collectionMetadata,
    collectionCover,
    nftImageMetadatas,
    imageFiles,
  };
};

async function retrieveCollectionImage(collectionUri: string): Promise<string> {
  try {
    const json = (await axios.get(collectionUri)).data;
    const collection_metadata_manifest = json.paths['collection.json'].id;

    try {
      const collection_metadata = (
        await axios.get(IrysGateway + collection_metadata_manifest)
      ).data;
      const collection_image_uri = collection_metadata.image;

      return collection_image_uri;
    } catch (e) {
      console.error('Failed to retrieve collection metadata', e);

      return '';
    }
  } catch (e) {
    console.error('Failed to retrieve collection image', e);

    return '';
  }
}

export const uploadCollectionData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aptosWallet: any,
  fileList: FileList,
): Promise<{
  collectionName: string;
  collectionDescription: string;
  collectionUri: string;
  fa_symbol: string;
  fa_icon: string;
  supply: number;
  tokenNames: Array<string>;
  tokenDescription: Array<string>;
  tokenUris: Array<string>;
}> => {
  // Convert FileList type into a File[] type
  const files: File[] = [];

  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  const collectionFiles = files.filter((file) => file.name.includes("collection"));

  if (collectionFiles.length !== 2) {
    throw new Error("Please make sure you include both collection.json and collection image file");
  }

  // Check collection.json file exists
  const collectionMetadata = collectionFiles.find((file) => file.name === "collection.json");

  if (!collectionMetadata) {
    throw new Error("Collection metadata not found, please make sure you include collection.json file");
  }

  const collectionCover = collectionFiles.find((file) =>
    VALID_MEDIA_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)),
  );

  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  const mediaExt = collectionCover?.name.split(".").pop();

  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  // Check nft metadata json files exist
  const nftImageMetadatas = files.filter((file) => file.name.endsWith("json") && file.name !== "collection.json");

  if (nftImageMetadatas.length === 0) {
    throw new Error("Image metadata not found, please make sure you include the NFT json files");
  }

  // Check NFT image files exist
  const imageFiles = files.filter((file) => file.name.endsWith(`.${mediaExt}`) && file.name !== collectionCover.name);

  if (imageFiles.length === 0) {
    throw new Error("Image files not found, please make sure you include the NFT image files");
  }

  // Check nft metadata json files amount is the same as the nft image files
  if (nftImageMetadatas.length !== imageFiles.length) {
    throw new Error("Mismatch between NFT metadata json files and images files");
  }

  // Calculate total files cost to upload to Irys
  const totalFileSize =
    collectionCover.size +
    collectionMetadata.size +
    imageFiles.reduce((acc, file) => acc + file.size, 0) +
    nftImageMetadatas.reduce((acc, file) => acc + file.size, 0);

  // Check total file size doesn't exceed 2GB due to a Browse constraints
  const GIGABYTE = Math.pow(1024, 3);
  const MAX_SIZE = 2 * GIGABYTE;

  if (totalFileSize > MAX_SIZE) {
    throw new Error("Files size should not exceed 2GB");
  }

  // // Check if need to first fund an Irys node
  const funded = await checkIfFund(aptosWallet, files);

  if (funded) {
    let imageFolderReceipt: string;

    try {
      // Upload collection thumbnail image and all NFT images as a folder
      imageFolderReceipt = await uploadFolder(aptosWallet, [...imageFiles, collectionCover]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error uploading collection image and NFT images ${error}`);
    }

    // Update collection metadata with the cover image
    const parsedCollectionMetadata: CollectionMetadata = JSON.parse(await collectionMetadata.text());

    parsedCollectionMetadata.image = `${imageFolderReceipt}/collection.${mediaExt}`;
    const updatedCollectionMetadata = new File([JSON.stringify(parsedCollectionMetadata)], "collection.json", {
      type: collectionMetadata.type,
    });
    const tokenNames: Array<string> = [];
    const tokenDescription: Array<string> = [];
    const tokenUris: Array<string> = [];
    // Update each image metadata with the related image URL
    const updatedImageMetadatas = await Promise.all(
      nftImageMetadatas.map(async (file) => {
        const metadata: ImageMetadata = JSON.parse(await file.text());
        const imageUrl = `${imageFolderReceipt}/${file.name.replace("json", `${mediaExt}`)}`;

        if (!metadata.description) {
          metadata.description = metadata.name;
        }

        tokenNames.push(file.name.replace(".json", ""));
        metadata.image = imageUrl;
        const fileMetadata = new File([JSON.stringify(metadata)], file.name, {
          type: file.type,
        });

        tokenDescription.push(metadata.description);

        console.log("metadata", metadata);

        return fileMetadata;
      }),
    );

    // Upload collection metadata and all NFTs' metadata as a folder
    try {
      const metadataFolderReceipt = await uploadFolder(aptosWallet, [
        ...updatedImageMetadatas,
        updatedCollectionMetadata,
      ]);


      for (const name of tokenNames) {
        tokenUris.push(`${metadataFolderReceipt}/${name}.json`);
      }

      return {
        collectionUri: `${metadataFolderReceipt}/`,
        collectionName: parsedCollectionMetadata.name,
        collectionDescription: parsedCollectionMetadata.description,
        fa_icon: imageFolderReceipt + "/collection." + mediaExt,
        fa_symbol: parsedCollectionMetadata.fa_symbol,
        supply: parsedCollectionMetadata.supply,
        tokenDescription,
        tokenUris,
        tokenNames
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error uploading collection metadata and NFTs' metadata ${error}`);
    }
  } else {
    throw new Error("Current account balance is not enough to fund a decentralized asset node");
  }
};
