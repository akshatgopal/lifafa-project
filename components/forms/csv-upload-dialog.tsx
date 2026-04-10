"use client";

import { useState, useRef } from "react";
import { Upload, FileUp, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { parseCSV } from "@/lib/csv";
import { CSVRow } from "@/types/guest";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

export function CSVUploadDialog({ open, onOpenChange, onUploadComplete }: CSVUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetDialog() {
    setSelectedFile(null);
    setPreviewData([]);
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("idle");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setPreviewData(parsed.slice(0, 5));
    };
    reader.readAsText(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("idle");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseCSV(text);

          setUploadProgress(30);

          const guestsToInsert = parsed.map((row) => ({
            name: row.name,
            relation: row.relation || null,
            phone: row.phone || null,
            address: row.address || null,
          }));

          setUploadProgress(60);

          await api.bulkUpsertGuests(guestsToInsert);

          setUploadProgress(100);
          setUploadStatus("success");
          setTimeout(() => {
            onOpenChange(false);
            resetDialog();
            onUploadComplete();
          }, 1500);
        } catch (innerError) {
          console.error("Upload error:", innerError);
          setUploadStatus("error");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetDialog(); }}>
      <DialogContent className="max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Upload Guest CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: name, relation, phone, address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              selectedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-2">
                <FileUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="ml-2"
                  onClick={(e) => { e.stopPropagation(); resetDialog(); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to select CSV file</p>
              </div>
            )}
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Preview (first 5 rows)</p>
              <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">Relation</th>
                      <th className="pb-2 pr-4">Phone</th>
                      <th className="pb-2">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="py-2 pr-4 font-medium">{row.name}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.relation}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.phone || "—"}</td>
                        <td className="py-2 text-muted-foreground">{row.address || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">Total: {previewData.length} guests (will insert all from file)</p>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-primary">Uploading guests...</span>
                <span className="text-primary">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-3 bg-muted" />
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              Guests uploaded successfully!
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="text-sm text-destructive">
              Failed to upload. Check your Supabase connection.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); resetDialog(); }} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload to Supabase"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
