import type React from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.name.endsWith(".pcd")) {
      onFileUpload(file);
    } else {
      alert("Please upload a valid PCD file");
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".pcd"
        onChange={handleFileChange}
        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 w:8 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
};
