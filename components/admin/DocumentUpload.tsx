"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onUpload?: (file: File) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    onUpload?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">문서 업로드</h3>
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            문서를 드래그하거나 클릭하여 업로드
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOCX, XLSX 파일 지원
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatBytes(selectedFile.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              /* TODO: 실제 업로드 API 연동 */
            }}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            업로드
          </button>
        </div>
      )}
    </div>
  );
}
