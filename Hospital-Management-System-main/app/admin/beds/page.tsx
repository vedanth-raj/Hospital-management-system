'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, LogOut, ArrowLeft } from 'lucide-react';

interface Bed {
  id: number;
  bedNumber: string;
  ward: string;
  bedType: string;
  floor: number;
  isAvailable: boolean;
  allocatedPatient: {
    id: number;
    name: string;
    patientId: string;
  } | null;
}

export default function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const res = await fetch('/api/admin/beds', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setBeds(data.beds);
        }
      } catch (error) {
        console.error('Error fetching beds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeds();
    const interval = setInterval(fetchBeds, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  };

  const getBedTypeColor = (bedType: string) => {
    switch (bedType) {
      case 'icu':
        return 'bg-destructive/20 text-destructive';
      case 'general':
        return 'bg-secondary/20 text-secondary';
      case 'pediatric':
        return 'bg-blue-500/20 text-blue-700';
      case 'maternity':
        return 'bg-pink-500/20 text-pink-700';
      case 'isolation':
        return 'bg-amber-500/20 text-amber-700';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-primary">Bed Management</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm mb-1">Total Beds</p>
              <p className="text-3xl font-bold text-primary">{beds.length}</p>
            </CardContent>
          </Card>
          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm mb-1">Available</p>
              <p className="text-3xl font-bold text-secondary">
                {beds.filter((b) => b.isAvailable).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm mb-1">Occupied</p>
              <p className="text-3xl font-bold text-destructive">
                {beds.filter((b) => !b.isAvailable).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Beds List */}
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle>Hospital Beds</CardTitle>
            <CardDescription>View and manage all hospital beds</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading beds...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {beds.map((bed) => (
                  <div
                    key={bed.id}
                    className="p-4 rounded-lg border border-secondary/20 hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">Bed {bed.bedNumber}</p>
                        <p className="text-sm text-muted-foreground">{bed.ward} - Floor {bed.floor}</p>
                      </div>
                      <Badge className={getBedTypeColor(bed.bedType)}>{bed.bedType}</Badge>
                    </div>

                    {bed.allocatedPatient ? (
                      <div className="p-3 rounded bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Occupied by</p>
                        <p className="font-semibold text-foreground text-sm">
                          {bed.allocatedPatient.name}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {bed.allocatedPatient.patientId}</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                        <p className="font-semibold text-green-700 text-sm">Available</p>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full mt-3 border-secondary/30">
                      {bed.isAvailable ? 'Allocate' : 'Release'}
                    </Button>
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
