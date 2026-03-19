'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function EmergencyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Emergency Cases</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-secondary/20">
          <CardContent className="pt-8">
            <Empty
              icon={AlertTriangle}
              title="No Emergency Cases"
              description="Emergency cases will be displayed here with real-time status updates."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
