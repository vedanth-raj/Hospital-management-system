'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Empty } from '@/components/ui/empty';
import { Heart, Users, LogOut, Stethoscope } from 'lucide-react';

interface QueuePatient {
  id: number;
  position: number;
  patientName: string;
  patientId: string;
  priority: string;
  status: string;
  estimatedWaitTime: number;
}

export default function DoctorQueuePage() {
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/doctor/queue', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setQueue(data.queue);
        }
      } catch (error) {
        console.error('Error fetching queue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-amber-500 text-white';
      case 'normal':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-500/20 text-blue-700';
      case 'in-consultation':
        return 'bg-secondary/20 text-secondary';
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
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">HealthHub</h1>
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
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-1">Total in Queue</p>
                <p className="text-3xl font-bold text-primary">{queue.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-1">Emergency Cases</p>
                <p className="text-3xl font-bold text-destructive">
                  {queue.filter((p) => p.priority === 'emergency').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-1">Next Patient</p>
                <p className="text-3xl font-bold text-secondary">
                  {queue.length > 0 ? `#${queue[0].position}` : 'None'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue List */}
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-secondary" />
              Patient Queue
            </CardTitle>
            <CardDescription>Manage patients waiting for consultation</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading queue...</div>
            ) : queue.length === 0 ? (
              <Empty
                icon={Users}
                title="No Patients in Queue"
                description="All caught up! No patients waiting at the moment."
              />
            ) : (
              <div className="space-y-3">
                {queue.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-secondary/20 hover:bg-secondary/5 transition-colors"
                  >
                    {/* Position */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{patient.position}</span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{patient.patientName}</p>
                      <p className="text-sm text-muted-foreground">ID: {patient.patientId}</p>
                    </div>

                    {/* Priority & Status */}
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(patient.priority)}>
                        {patient.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(patient.status)}>
                        {patient.status === 'in-consultation' ? 'In Consultation' : 'Waiting'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    {patient.status === 'waiting' && (
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={async () => {
                          await fetch('/api/doctor/queue', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ queueId: patient.id, status: 'in-consultation' }),
                            credentials: 'include',
                          });
                          // Refresh queue
                          const res = await fetch('/api/doctor/queue', { credentials: 'include' });
                          if (res.ok) {
                            const data = await res.json();
                            setQueue(data.queue);
                          }
                        }}
                      >
                        Start Consultation
                      </Button>
                    )}
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
