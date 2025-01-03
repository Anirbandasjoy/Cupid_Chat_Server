import { image_upload_api_key } from "@/config";
import axios from "axios";

export const uploadImage = async (imageFile: any): Promise<string | null> => {
  try {
    if (!imageFile || !imageFile.data || !imageFile.name) {
      console.error("No valid image file received", imageFile);
      return null;
    }

    // Convert the image buffer to a Blob
    const imageBlob = new Blob([imageFile.data], { type: imageFile.mimetype });

    const formData = new FormData();
    formData.append("image", imageBlob, imageFile.name);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${image_upload_api_key}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.url) {
      console.log("Image uploaded successfully:", response.data.data.url);
      return response.data.data.url;
    }

    console.error("Error in uploading image:", response.data);
    return null;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
};
