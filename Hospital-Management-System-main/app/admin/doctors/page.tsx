'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Stethoscope } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  isAvailable: boolean;
  queueLoad: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/admin/doctors', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error('Error loading doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Doctor Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-secondary" />
              Active Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No doctors found.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="rounded-lg border border-secondary/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.email}</p>
                      </div>
                      <Badge className={doctor.isAvailable ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}>
                        {doctor.isAvailable ? 'On Duty' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">Specialization</p>
                      <p className="font-medium text-foreground">{doctor.specialization}</p>
                      <p className="text-muted-foreground">License</p>
                      <p className="font-medium text-foreground">{doctor.licenseNumber}</p>
                      <p className="text-muted-foreground">Queue Load</p>
                      <p className="font-medium text-foreground">{doctor.queueLoad}</p>
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
