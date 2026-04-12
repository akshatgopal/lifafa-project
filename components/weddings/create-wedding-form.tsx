"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { Wedding } from "@/types/wedding";

const schema = z.object({
  event_name: z.string().trim().min(1, "Please give this wedding a name"),
  event_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onCreated: (wedding: Wedding) => void;
}

export function CreateWeddingForm({ onCreated }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { event_name: "", event_date: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    const trimmedDate = values.event_date?.trim();
    try {
      const wedding = await api.createWedding({
        event_name: values.event_name.trim(),
        event_date: trimmedDate ? trimmedDate : null,
      });
      onCreated(wedding);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create wedding"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event_name">Wedding name</Label>
        <Input
          id="event_name"
          placeholder="e.g. Sharma–Verma Wedding"
          aria-invalid={!!errors.event_name}
          {...register("event_name")}
        />
        {errors.event_name && (
          <p className="text-[12px] text-destructive">
            {errors.event_name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event_date">
          Event date <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id="event_date" type="date" {...register("event_date")} />
      </div>

      {submitError && (
        <p className="text-[12px] text-destructive">{submitError}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create wedding
      </Button>
    </form>
  );
}
