export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ImageParseError =
  | "IMAGE_REQUIRED"
  | "INVALID_IMAGE_TYPE"
  | "IMAGE_TOO_LARGE";

export type ParsedImageFile = {
  file: File;
  ext: "jpg" | "png" | "webp";
};

export function parseImageFile(
  formData: FormData,
  fieldName = "image",
):
  | { ok: true; data: ParsedImageFile }
  | { ok: false; error: ImageParseError } {
  const image = formData.get(fieldName);

  if (!(image instanceof File) || image.size === 0) {
    return { ok: false, error: "IMAGE_REQUIRED" };
  }
  if (!ALLOWED_IMAGE_MIMES.has(image.type)) {
    return { ok: false, error: "INVALID_IMAGE_TYPE" };
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "IMAGE_TOO_LARGE" };
  }

  const ext =
    image.type === "image/png"
      ? "png"
      : image.type === "image/webp"
        ? "webp"
        : "jpg";

  return { ok: true, data: { file: image, ext } };
}
