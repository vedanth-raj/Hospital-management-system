'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, BarChart3, Users, Bed, AlertTriangle, Calendar } from 'lucide-react';

interface Stats {
  visitsTodayCount: number;
  appointmentsTodayCount: number;
  emergencyCasesToday: number;
  totalBeds: number;
  availableBeds: number;
  patientsInQueue: number;
  doctorsOnDuty: number;
  totalPatients: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">HealthHub Admin</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Hospital Dashboard</h2>
          <p className="text-muted-foreground">Real-time hospital management and analytics</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading statistics...</div>
        ) : stats ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Visits Today */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Visits Today</p>
                      <p className="text-3xl font-bold text-primary">{stats.visitsTodayCount}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              {/* Appointments */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Appointments Today</p>
                      <p className="text-3xl font-bold text-secondary">{stats.appointmentsTodayCount}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-secondary/20" />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Cases */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Emergency Cases</p>
                      <p className="text-3xl font-bold text-destructive">
                        {stats.emergencyCasesToday}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-destructive/20" />
                  </div>
                </CardContent>
              </Card>

              {/* Beds Available */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Beds Available</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {stats.availableBeds}/{stats.totalBeds}
                      </p>
                    </div>
                    <Bed className="w-8 h-8 text-blue-600/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Patients in Queue */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Patients in Queue</p>
                  <p className="text-4xl font-bold text-primary mb-4">
                    {stats.patientsInQueue}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-secondary/30"
                    onClick={() => router.push('/reception/queue')}
                  >
                    View Queue
                  </Button>
                </CardContent>
              </Card>

              {/* Doctors on Duty */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Doctors on Duty</p>
                  <p className="text-4xl font-bold text-secondary mb-4">
                    {stats.doctorsOnDuty}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-secondary/30"
                    onClick={() => router.push('/admin/doctors')}
                  >
                    View Doctors
                  </Button>
                </CardContent>
              </Card>

              {/* Total Patients */}
              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Patients</p>
                  <p className="text-4xl font-bold text-blue-600 mb-4">
                    {stats.totalPatients}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-secondary/30"
                    onClick={() => router.push('/admin/patients')}
                  >
                    View Patients
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="border-secondary/30"
                    onClick={() => router.push('/admin/beds')}
                  >
                    <Bed className="w-4 h-4 mr-2" />
                    Manage Beds
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary/30"
                    onClick={() => router.push('/admin/emergency')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Cases
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary/30"
                    onClick={() => router.push('/admin/analytics')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary/30"
                    onClick={() => router.push('/reception/queue')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Hospital Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Failed to load statistics</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
