'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';

interface Patient {
  id: number;
  patientId: string;
  name: string;
  email: string;
  bloodType: string;
  allergies: string;
  lastAppointmentDate: string | null;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/admin/patients', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setPatients(data.patients || []);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Patient Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Registered Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No patients found.</div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div key={patient.id} className="rounded-lg border border-secondary/20 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">{patient.patientId}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                      <p><span className="text-muted-foreground">Blood Type:</span> {patient.bloodType || 'NA'}</p>
                      <p><span className="text-muted-foreground">Allergies:</span> {patient.allergies || 'None'}</p>
                      <p>
                        <span className="text-muted-foreground">Last Appointment:</span>{' '}
                        {patient.lastAppointmentDate
                          ? new Date(patient.lastAppointmentDate).toLocaleDateString()
                          : 'No visits yet'}
                      </p>
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
