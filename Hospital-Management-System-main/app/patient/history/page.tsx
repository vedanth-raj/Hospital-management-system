'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';
import { ArrowLeft, Clock } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Visit History</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card className="border-secondary/20">
          <CardContent className="pt-8">
            <Empty
              icon={Clock}
              title="No Visit History"
              description="Your visit history will appear here after your first consultation."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
