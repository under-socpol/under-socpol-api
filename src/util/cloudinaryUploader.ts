import cloudinary from "@/config/cloudinary.js";

async function uploadImage(base64: string | undefined, blockId: string): Promise<string> {
  if (!base64) throw new Error("Invalid base64 image data");

  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: `${blockId}`,
        folder: "articles",
        resource_type: "image",
        overwrite: true,
        format: "jpg",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(new Error("Upload failed"));
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function processContentImages(content: any) {
  const blocks = content.blocks || [];
  const updatedBlocks = await Promise.all(
    blocks.map(async (block: any) => {
      if (block.type === "image") {
        const base64Image = block?.data?.file?.url;

        if (!base64Image) {
          return block;
        }

        try {
          const secureUrl = await uploadImage(base64Image, block.id);

          return {
            ...block,
            data: {
              ...block.data,
              url: secureUrl,
              file: {
                url: secureUrl,
              },
            },
          };
        } catch (error) {
          return block;
        }
      }

      return block;
    })
  );

  return {
    ...content,
    blocks: updatedBlocks,
  };
}

function extractImageBlockIds(content: any): string[] {
  return (content.blocks || []).filter((block: any) => block.type === "image" && block.id).map((block: any) => block.id);
}

export async function deleteUnusedImages(oldContent: any, newContent: any) {
  const oldIds = extractImageBlockIds(oldContent);
  const newIds = extractImageBlockIds(newContent);

  const removedIds = oldIds.filter((id) => !newIds.includes(id));

  if (removedIds.length === 0) return;

  await Promise.all(removedIds.map(async (id) => await cloudinary.uploader.destroy(`articles/${id}`)));
}

export async function deleteImages(content: any) {
  const ids = extractImageBlockIds(content);

  if (ids.length === 0) return;

  await Promise.all(ids.map(async (id) => await cloudinary.uploader.destroy(`articles/${id}`)));
}
