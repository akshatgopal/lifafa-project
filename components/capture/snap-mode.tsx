"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, CheckCircle2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Numpad } from "@/components/shared/numpad";

interface SnapModeProps {
  onDone: () => void;
}

export function SnapMode({ onDone }: SnapModeProps) {
  const [numpadValue, setNumpadValue] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImage(URL.createObjectURL(file));
  }

  function reset() {
    setNumpadValue("");
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onDone();
  }

  return (
    <div className="grid grid-cols-2 gap-6 items-stretch min-h-[520px]">
      {/* LEFT: photo */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Envelope Photo</p>

        <div className="relative flex-1 min-h-[360px] rounded-xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center">
          {uploadedImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedImage} alt="Envelope" className="w-full h-full object-cover" />
              <Button variant="ghost" size="icon-sm"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={() => { setUploadedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                <X strokeWidth={2} />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No photo yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Snap or upload the lifafa</p>
              </div>
            </div>
          )}
          {!uploadedImage && [["top-3 left-3","border-t border-l"],["top-3 right-3","border-t border-r"],["bottom-3 left-3","border-b border-l"],["bottom-3 right-3","border-b border-r"]].map(([pos, bdr], i) => (
            <div key={i} className={`absolute ${pos} h-5 w-5 ${bdr} border-primary/40`} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 shrink-0">
          <Button variant="outline" className="gap-2">
            <Camera strokeWidth={1.75} /> Snap Photo
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload strokeWidth={1.75} /> Upload
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>

        {uploadedImage && (
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-500 shrink-0">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} /> Photo ready · will upload on save
          </p>
        )}
      </div>

      {/* RIGHT: numpad */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Amount Inside</p>
        <Card className="flex-1 p-5 gap-0">
          <CardContent className="p-0 h-full flex flex-col">
            <Numpad value={numpadValue} onChange={setNumpadValue} onSave={reset} onCancel={reset} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
