"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StaffError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-muted-foreground">
              {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <Button onClick={() => reset()}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
