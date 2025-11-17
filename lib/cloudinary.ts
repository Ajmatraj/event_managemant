import { v2 as cloudinary } from "cloudinary"
import DatauriParser from "datauri/parser"

const parser = new DatauriParser()

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 🌩️ Verify configuration once
console.log("🌩️ Cloudinary initialized:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  apiKeyLoaded: !!process.env.CLOUDINARY_API_KEY,
  apiSecretLoaded: !!process.env.CLOUDINARY_API_SECRET,
})

/**
 * ✅ Upload file from local path (used by Multer or temp files)
 */
export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) throw new Error("Missing local file path.")

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "uploads",
    })

    console.log("✅ Uploaded to Cloudinary (local path):", response.secure_url)

    return {
      url: response.secure_url,
      publicId: response.public_id,
      type: response.resource_type,
    }
  } catch (error: any) {
    console.error("❌ [uploadOnCloudinary] Error:", error.message || error)
    return null
  }
}

/**
 * ✅ Upload file buffer (from FormData in API route)
 * Uses Cloudinary upload_stream for best performance and binary safety.
 */
export const uploadBufferToCloudinary = async (
  fileBuffer: Buffer,
  mimeType: string,
  folder: string
) => {
  try {
    if (!fileBuffer || !mimeType) throw new Error("Missing buffer or mimetype.")

    console.log(`📤 Uploading buffer to Cloudinary [${mimeType}]...`)

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: mimeType.startsWith("video") ? "video" : "image",
        },
        (error, result) => {
          if (error) {
            console.error("❌ [uploadBufferToCloudinary] Cloudinary Error:", error)
            return reject(error)
          }
          console.log(
            `✅ Uploaded ${mimeType.startsWith("video") ? "video" : "image"} to Cloudinary:`,
            result?.secure_url
          )
          resolve({
            url: result?.secure_url,
            publicId: result?.public_id,
            type: result?.resource_type,
          })
        }
      )

      uploadStream.end(fileBuffer)
    })
  } catch (error: any) {
    console.error("💥 [uploadBufferToCloudinary] Failed to upload buffer:", error.message || error)
    return null
  }
}

/**
 * ✅ Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  type: "image" | "video" = "image"
) => {
  try {
    if (!publicId) throw new Error("Missing publicId.")

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    })

    console.log(`🗑️ Deleted from Cloudinary [${type}]:`, publicId)
    return result.result === "ok"
  } catch (error: any) {
    console.error("❌ [deleteFromCloudinary] Error:", error.message || error)
    return false
  }
}
