"use client";

import FAQ from "@/components/ui/FAQ";

export default function DocsPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Documentation &amp; Help</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Find answers to common questions and get help using Travelytics.
      </p>

      <FAQ />
    </main>
  );
}
