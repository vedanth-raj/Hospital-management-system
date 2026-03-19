'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface EmergencyCase {
  id: number;
  patientName: string;
  patientId: string;
  severity: string;
  description: string;
  status: string;
  assignedDoctor: string;
  createdAt: string;
}

export default function EmergencyPage() {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/admin/emergency', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error loading emergency cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const updateStatus = async (caseId: number, status: string) => {
    await fetch('/api/admin/emergency', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ caseId, status }),
    });
    fetchCases();
  };

  const severityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-amber-500 text-white';
      case 'moderate':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Emergency Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">Loading emergency cases...</div>
            ) : cases.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No emergency cases currently.</div>
            ) : (
              <div className="space-y-3">
                {cases.map((item) => (
                  <div key={item.id} className="rounded-lg border border-secondary/20 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{item.patientName} ({item.patientId})</p>
                      <div className="flex items-center gap-2">
                        <Badge className={severityClass(item.severity)}>{item.severity}</Badge>
                        <Badge variant="outline" className="capitalize">{item.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Assigned: {item.assignedDoctor} | Reported {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'in-progress')}>
                        Mark In Progress
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(item.id, 'resolved')}>
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
