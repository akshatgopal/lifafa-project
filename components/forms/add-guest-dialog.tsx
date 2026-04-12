"use client";

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";

interface AddGuestDialogProps {
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestAdded: () => void;
}

export function AddGuestDialog({ weddingId, open, onOpenChange, onGuestAdded }: AddGuestDialogProps) {
  const [guestName, setGuestName] = useState("");
  const [guestRelation, setGuestRelation] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  function resetForm() {
    setGuestName("");
    setGuestRelation("");
    setGuestPhone("");
    setGuestAddress("");
    setSaveError("");
    setSaveSuccess(false);
  }

  async function handleAddGuest() {
    if (!guestName.trim()) {
      setSaveError("Name is required");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      await api.createGuest(weddingId, {
        name: guestName.trim(),
        relation: guestRelation.trim() || null,
        phone: guestPhone.trim() || null,
        address: guestAddress.trim() || null,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
        onGuestAdded();
      }, 1500);
    } catch (error) {
      console.error("Add guest error:", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to add guest. Check your backend connection."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Guest
          </DialogTitle>
          <DialogDescription>
            Manually add a guest to your directory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="guestName" className="text-sm font-medium">Name *</label>
            <Input
              id="guestName"
              placeholder="Enter guest name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="guestRelation" className="text-sm font-medium">Relation</label>
            <Input
              id="guestRelation"
              placeholder="e.g., Uncle, Aunt, Friend"
              value={guestRelation}
              onChange={(e) => setGuestRelation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="guestPhone" className="text-sm font-medium">Phone</label>
            <Input
              id="guestPhone"
              placeholder="+91 98765 43210"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="guestAddress" className="text-sm font-medium">Address</label>
            <Input
              id="guestAddress"
              placeholder="Enter address"
              value={guestAddress}
              onChange={(e) => setGuestAddress(e.target.value)}
            />
          </div>

          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {saveError}
            </div>
          )}

          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              Guest added successfully!
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleAddGuest} disabled={isSaving || !guestName.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Guest"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
