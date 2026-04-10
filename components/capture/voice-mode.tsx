"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, Play, Pause, RotateCcw, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

interface VoiceModeProps {
  onCancel: () => void;
}

export function VoiceMode({ onCancel }: VoiceModeProps) {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  function discardRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setPlaying(false);
  }

  function togglePlayback() {
    if (!audioRef.current || !audioUrl) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function handleAudioEnded() {
    setPlaying(false);
  }

  async function handleSave() {
    if (!audioBlob) return;
    setError(null);
    setSaving(true);

    try {
      await api.createVoice(audioBlob, `voice_${Date.now()}.webm`);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save recording");
      setSaving(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const hasRecording = !!audioBlob && !!audioUrl;

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {hasRecording ? "Review your recording" : "Hold the button and dictate"}
        </p>
        {!hasRecording && (
          <p className="text-xs text-muted-foreground/60 italic">
            &ldquo;Ramesh uncle gave 2100 cash&rdquo;
          </p>
        )}
      </div>

      {/* Record button — hidden once we have a recording */}
      {!hasRecording && (
        <>
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={() => recording && stopRecording()}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all select-none ${
              recording
                ? "bg-primary scale-110 shadow-[0_0_40px_hsl(var(--primary)/0.35)]"
                : "bg-secondary hover:bg-accent border border-border"
            }`}
          >
            {recording && (
              <>
                <span className="absolute h-full w-full rounded-full bg-primary/20 animate-ping" />
                <span className="absolute h-[120%] w-[120%] rounded-full bg-primary/10 animate-ping" />
              </>
            )}
            <Mic
              className={`relative h-9 w-9 ${recording ? "text-primary-foreground" : "text-muted-foreground"}`}
              strokeWidth={1.75}
            />
          </button>
          <p className="text-sm text-muted-foreground">
            {recording ? (
              <span className="text-primary font-medium">
                Recording… {formatTime(duration)}
              </span>
            ) : (
              "Hold to record"
            )}
          </p>
        </>
      )}

      {/* Playback card — shown after recording */}
      {hasRecording && (
        <Card className="w-full">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full shrink-0"
                onClick={togglePlayback}
              >
                {playing ? (
                  <Pause className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" strokeWidth={2} />
                )}
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Voice Recording</p>
                <p className="text-xs text-muted-foreground">{formatTime(duration)}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
            </div>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={discardRecording}
                disabled={saving}
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                Re-record
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={discardRecording}
                disabled={saving}
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {/* Action buttons */}
      <div className="w-full flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        {hasRecording && (
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 strokeWidth={2.5} />
            )}
            {saving ? "Saving…" : "Save Entry"}
          </Button>
        )}
      </div>
    </div>
  );
}
