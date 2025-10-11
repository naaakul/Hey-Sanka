import JSZip from "jszip";

export default async (files: { path: string; content: string }[]) => {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, file.content);
  }
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer;
};
