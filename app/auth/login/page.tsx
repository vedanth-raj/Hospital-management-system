'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, AlertCircle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StaffLogin() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const normalizedStaffId = staffId.trim().toUpperCase();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          staffId: normalizedStaffId,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Invalid Staff ID or password');
        return;
      }

      const role = data?.user?.role || 'staff';
      const mustChangePassword = Boolean(data?.user?.mustChangePassword) || password === '123456';

      if (mustChangePassword) {
        toast({
          title: 'Password update required',
          description: 'Please change your default password to continue.',
        });
        router.push('/auth/change-password');
        return;
      }

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${role}`,
      });

      const roleRedirects: Record<string, string> = {
        admin: '/admin/dashboard',
        doctor: '/doctor/queue',
        reception: '/reception/dashboard',
        driver: '/driver/dashboard',
      };

      router.push(roleRedirects[role] || '/');

    } catch (err: any) {
      setError(err.message || 'Invalid Staff ID or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">HealthHub</h1>
          </div>
          <p className="text-muted-foreground">Hospital Staff Portal</p>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              Staff Login
            </CardTitle>
            <CardDescription>Sign in with your 8-character Staff ID</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-border p-2 bg-muted/40">
              <Button type="button" className="w-full" disabled>
                Staff
              </Button>
              <Link href="/auth/patient-setup" className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  Patient
                </Button>
              </Link>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="staff-id" className="text-sm font-medium text-foreground">
                  Staff ID
                </label>
                <Input
                  id="staff-id"
                  type="text"
                  placeholder="e.g. A1000001"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value.toUpperCase().slice(0, 8))}
                  disabled={isLoading}
                  required
                  maxLength={8}
                  className="font-mono tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || staffId.length !== 8} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-secondary/10 text-center">
              <p className="text-sm text-muted-foreground mb-3">Are you a patient?</p>
              <Link href="/auth/patient-setup">
                <Button variant="outline" className="w-full border-secondary/30">
                  Patient Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-4 bg-secondary/5 border-secondary/20">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">
              Demo IDs:
            </p>
            <div className="mt-2 text-xs space-y-1 text-muted-foreground">
              <p>A1000001</p>
              <p>D1000002</p>
              <p>R1000003</p>
            </div>
            <p className="text-xs mt-3 italic">Password: Use the password set for that staff account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}