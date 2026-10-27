import { CalendarCheck2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify, useApp } from "@/lib/store";
import type { Mentor } from "@/types";

const times = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "11:00 AM"];

export function BookSessionDialog({
  mentor,
  open,
  onOpenChange,
  initialSlot,
}: {
  mentor: Mentor;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialSlot?: string;
}) {
  const { bookSession } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(times[0]!);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(today);
    setTime(times[0]!);
    setTopic(initialSlot ? `Session requested for ${initialSlot}` : "");
    setError("");
    setDone(false);
  }, [open, initialSlot, today]);

  async function confirm() {
    if (!date) {
      setError("Pick a date for your session.");
      return;
    }
    if (topic.trim().length < 8) {
      setError("Describe what you want to cover (at least 8 characters).");
      return;
    }
    const when = `${new Date(date).toDateString()} · ${time}`;
    await bookSession(mentor.id, mentor.name, when, topic.trim());
    setDone(true);
    notify("Session booked", `${mentor.name} · ${when}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-success" />
            <h2 className="font-display text-xl font-semibold">Booking confirmed</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Your 1:1 with {mentor.name} is confirmed for {new Date(date).toDateString()} at {time}
              . It now appears in your mentorship hub.
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button asChild>
                <a href="/dashboard/mentorship">Open mentorship hub</a>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a session — {mentor.name}</DialogTitle>
            </DialogHeader>
            <p className="-mt-2 text-sm text-muted-foreground">
              {mentor.company} · usual slots: {mentor.availability.join(", ")}
            </p>
            <div className="mt-2 grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium">Date</Label>
                <Input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium">Time</Label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-3 text-sm"
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium">Topic</Label>
                <Textarea
                  rows={3}
                  value={topic}
                  maxLength={300}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Review my dashboard project and mock interview on React performance"
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => void confirm()}>
                <CalendarCheck2 className="size-4" /> Confirm booking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
