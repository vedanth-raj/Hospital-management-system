'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Hospital Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Placeholder Cards for Analytics */}
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-secondary/5 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                Queue Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-secondary/5 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 md:col-span-2">
            <CardHeader>
              <CardTitle>Hospital Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-secondary/5 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Heatmap visualization will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
