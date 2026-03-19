'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, LogOut, Users } from 'lucide-react';

export default function ReceptionDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">HealthHub - Reception</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Reception Dashboard</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Hospital Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">View and manage patient queues across all departments</p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => router.push('/reception/queue')}
              >
                View Queue
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">Available soon</p>
              <Button variant="outline" className="w-full border-secondary/30" disabled>
                Add Patient to Queue
              </Button>
              <Button variant="outline" className="w-full border-secondary/30" disabled>
                Check In Patient
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
