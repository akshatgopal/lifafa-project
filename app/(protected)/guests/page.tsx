"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Upload, UserPlus, Users, MoreHorizontal, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddGuestDialog } from "@/components/forms/add-guest-dialog";
import { CSVUploadDialog } from "@/components/forms/csv-upload-dialog";
import { api } from "@/lib/api";
import { Guest } from "@/types/guest";
import { useWeddingStore } from "@/store/wedding-store";

export default function GuestsPage() {
  // Under WeddingGuard this is guaranteed non-null.
  const wedding = useWeddingStore((s) => s.wedding)!;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding.id]);

  async function fetchGuests() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listGuests(wedding.id);
      setGuests(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  }

  const filteredGuests = useMemo(() => {
    if (!search.trim()) return guests;
    const q = search.toLowerCase();
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.relation && g.relation.toLowerCase().includes(q))
    );
  }, [guests, search]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const safeePage = Math.min(page, totalPages);
  const paginatedGuests = filteredGuests.slice(
    (safeePage - 1) * pageSize,
    safeePage * pageSize
  );

  const totalGuests = guests.length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">Guest Directory</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{totalGuests} guests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}><Upload strokeWidth={1.5} /> Upload CSV</Button>
          <Button size="sm" onClick={() => setIsAddGuestOpen(true)}><UserPlus strokeWidth={2} /> Add Guest</Button>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card size="sm">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <CardDescription>Total Guests</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{totalGuests}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">On the list</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={2} />
            <Input
              placeholder="Search by name or relation..."
              className="pl-8 h-8"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <Card className="p-0 gap-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchGuests}>Retry</Button>
            </div>
          ) : guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Users className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No guests yet</p>
              <Button size="sm" onClick={() => setIsAddGuestOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Add your first guest</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Name", "Relation", "Phone", "Address", "Added On", ""].map((col) => (
                    <TableHead key={col} className="text-[11px] uppercase tracking-wider">{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGuests.map((guest) => (
                  <TableRow key={guest.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground ring-1 ring-border shrink-0">
                          {guest.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground text-sm">{guest.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {guest.relation || <span className="text-muted-foreground/40">—</span>}
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {guest.phone || <span className="text-muted-foreground/30">—</span>}
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {guest.address || <span className="text-muted-foreground/30">—</span>}
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {new Date(guest.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal strokeWidth={1.75} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Separator />
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {filteredGuests.length === totalGuests
                ? `${totalGuests} guests total`
                : `${filteredGuests.length} of ${totalGuests} guests`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safeePage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {safeePage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safeePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AddGuestDialog
        weddingId={wedding.id}
        open={isAddGuestOpen}
        onOpenChange={setIsAddGuestOpen}
        onGuestAdded={fetchGuests}
      />
      <CSVUploadDialog
        weddingId={wedding.id}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUploadComplete={fetchGuests}
      />
    </div>
  );
}
