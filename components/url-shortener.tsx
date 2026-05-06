"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessCue, setShowSuccessCue] = useState(false);

  useEffect(() => {
    if (!showSuccessCue) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSuccessCue(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [showSuccessCue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setShowSuccessCue(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        shortUrl?: string;
      };

      if (!response.ok || !data.shortUrl) {
        throw new Error(data.error ?? "Failed to shorten URL.");
      }

      setShortUrl(data.shortUrl);
      setShowSuccessCue(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to shorten URL. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Successfully copied the Short URL!");
  };

  //return styling
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-md w-full space-y-4 p-6 rounded-lg bg-background shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">URL Shortener</h1>
          <p className="text-muted-foreground">
            Enter a long URL and get a short, shareable link.
          </p>
        </div>
        {/* Form section*/}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type="url"
              placeholder="Paste your long URL here"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="pr-16"
              required
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Shortening..." : "Shorten"}
            </Button>
          </div>
          <div aria-live="polite" className="space-y-2">
            <div
              className={`status-rail ${
                isSubmitting
                  ? "status-rail--loading"
                  : showSuccessCue
                    ? "status-rail--success"
                    : ""
              }`}
            >
              <span className="status-rail__track" />
              <span className="status-rail__shuttle" />
            </div>
            <div className="min-h-5 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
              {isSubmitting
                ? "threading your link"
                : showSuccessCue
                  ? "fresh short link ready"
                  : "paste. shorten. share."}
            </div>
          </div>
          {/* Display error if necessary */}
          {error && <div className="text-red-500 text-center">{error}</div>}
          {/* Display short URL and copy button */}
          {shortUrl && (
            <div
              className={`result-card flex items-center space-x-2 ${
                showSuccessCue ? "result-card--success" : ""
              }`}
            >
              <div className="flex-1">
                <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  short link
                </div>
                <Input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="cursor-pointer"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted/50"
                onClick={handleCopy}
              >
                <CopyIcon className="w-5 h-5" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
