'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, UserPlus, Copy, ShieldCheck, Users, ToggleLeft, ToggleRight, Pencil, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const DOCTOR_SPECIALIZATIONS = [
  'General Medicine', 'Cardiology', 'Orthopedics', 'Dermatology',
  'Pediatrics', 'Neurology', 'Psychiatry', 'ENT', 'Gynecology', 'Urology',
];

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  doctor: 'bg-blue-100 text-blue-800',
  reception: 'bg-green-100 text-green-800',
  driver: 'bg-amber-100 text-amber-800',
};

const ROLE_CARDS = [
  { role: 'admin',     prefix: 'A', label: 'Admins' },
  { role: 'doctor',    prefix: 'D', label: 'Doctors' },
  { role: 'reception', prefix: 'R', label: 'Receptionists' },
  { role: 'driver',    prefix: 'E', label: 'Drivers' },
];

interface StaffUser {
  id: string;                    // Firebase document ID (email)
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  specialization?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt?: any;
}

const EMPTY_FORM = { 
  firstName: '', 
  lastName: '', 
  email: '',
  role: '', 
  phone: '', 
  specialization: '' 
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [createError, setCreateError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load staff list');
      }
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (e) {
      console.error("Error loading users:", e);
      toast.error("Failed to load staff list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const visibleUsers = activeFilter 
    ? users.filter((u) => u.role === activeFilter) 
    : users;

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (rawValue: string) => {
    const email = rawValue.trim().toLowerCase();
    setForm((prev) => ({ ...prev, email }));
    setCreateError('');

    if (!email) {
      setEmailError('');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
  };

  const handlePhoneChange = (rawValue: string) => {
    const phone = rawValue.replace(/\D/g, '').slice(0, 10);
    setForm((prev) => ({ ...prev, phone }));
    setCreateError('');

    if (!phone) {
      setPhoneError('');
      return;
    }

    if (phone.length < 10) {
      setPhoneError('Mobile number must be 10 digits');
      return;
    }

    setPhoneError('');
  };

  // ==================== CREATE NEW STAFF ====================
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!form.firstName || !form.lastName || !form.email || !form.role || !form.phone) {
      setCreateError('Please fill all required fields');
      return;
    }

    if (!isValidEmail(form.email)) {
      setCreateError('Please enter a valid email address');
      return;
    }

    if (emailError || phoneError) {
      setCreateError('Please resolve duplicate email/phone errors before creating account');
      return;
    }

    setIsCreating(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const normalizedPhone = form.phone.trim();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          role: form.role,
          specialization: form.specialization || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data?.error || 'Failed to create staff account';
        if (message.toLowerCase().includes('email')) {
          setEmailError('This email is already used by another user');
        }
        if (message.toLowerCase().includes('phone') || message.toLowerCase().includes('mobile')) {
          setPhoneError('This mobile number is already used by another user');
        }
        setCreateError(message);
        return;
      }

      const created = data?.user;
      setCreatedUser({
        staffId: created?.staffId || '',
        firstName: created?.firstName || form.firstName,
        lastName: created?.lastName || form.lastName,
        role: created?.role || form.role,
      });

      toast.success(`Staff created successfully! ID: ${created?.staffId || ''}`);

      setForm(EMPTY_FORM);
      await loadUsers();        // Refresh list

    } catch (err: any) {
      console.error(err);
      setCreateError(err.message || "Failed to create staff account");
    } finally {
      setIsCreating(false);
    }
  };

  const copyStaffId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Staff ID copied to clipboard!');
  };

  const roleCount = (role: string) => users.filter((u) => u.role === role).length;

  const listTitle = activeFilter
    ? `${ROLE_CARDS.find((r) => r.role === activeFilter)?.label} (${visibleUsers.length})`
    : `All Staff (${users.length})`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-secondary/10 sticky top-0 bg-background/95 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Staff Management</h1>
              <p className="text-xs text-muted-foreground">Create and manage hospital staff accounts</p>
            </div>
          </div>

          <Dialog open={createOpen} onOpenChange={(o) => { 
            setCreateOpen(o); 
            if (!o) { 
              setCreatedUser(null); 
              setCreateError(''); 
              setForm(EMPTY_FORM); 
            } 
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" /> Add Staff
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Staff Account</DialogTitle>
                <DialogDescription>
                  Default password is <span className="font-mono font-bold">123456</span>. 
                  Staff must change it on first login.
                </DialogDescription>
              </DialogHeader>

              {createdUser ? (
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border-2 border-primary bg-primary/5 p-6 text-center space-y-4">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
                    <p className="font-semibold text-xl">
                      {createdUser.firstName} {createdUser.lastName}
                    </p>
                    <Badge className={ROLE_COLORS[createdUser.role]}>{createdUser.role.toUpperCase()}</Badge>
                    
                    <div className="p-4 bg-white rounded border-2 border-dashed border-primary">
                      <p className="text-xs text-muted-foreground mb-1">Staff ID</p>
                      <p className="text-3xl font-mono font-bold text-primary tracking-widest">
                        {createdUser.staffId}
                      </p>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => copyStaffId(createdUser.staffId)}>
                      <Copy className="w-4 h-4 mr-2" /> Copy Staff ID
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setCreatedUser(null)}>
                      Add Another
                    </Button>
                    <Button className="flex-1" onClick={() => setCreateOpen(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  {createError && (
                    <Alert variant="destructive">
                      <AlertDescription>{createError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name *</Label>
                      <Input 
                        value={form.firstName} 
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input 
                        value={form.lastName} 
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                        placeholder="Doe" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => void handleEmailChange(e.target.value)}
                      placeholder="doctor@hospital.com"
                      required
                    />
                    {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                  </div>

                  <div>
                    <Label>Role *</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin (A)</SelectItem>
                        <SelectItem value="doctor">Doctor (D)</SelectItem>
                        <SelectItem value="reception">Receptionist (R)</SelectItem>
                        <SelectItem value="driver">Driver (E)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.role === 'doctor' && (
                    <div>
                      <Label>Specialization</Label>
                      <Select value={form.specialization} onValueChange={(v) => setForm({ ...form, specialization: v })}>
                        <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                        <SelectContent>
                          {DOCTOR_SPECIALIZATIONS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Mobile Number *</Label>
                    <Input 
                      type="tel" 
                      value={form.phone} 
                      onChange={(e) => void handlePhoneChange(e.target.value)} 
                      placeholder="9876543210" 
                      required 
                    />
                    {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
                  </div>

                  <div className="rounded bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    <KeyRound className="w-3 h-3 inline mr-1" />
                    Default password will be <span className="font-mono font-bold">123456</span>
                  </div>

                  <Button type="submit" disabled={isCreating || Boolean(emailError) || Boolean(phoneError)} className="w-full">
                    {isCreating ? 'Creating Account...' : 'Create & Generate Staff ID'}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Rest of your UI (Role cards + Staff list) remains mostly same */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Role filter cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLE_CARDS.map(({ role, prefix, label }) => {
            const isActive = activeFilter === role;
            return (
              <Card
                key={role}
                onClick={() => setActiveFilter(isActive ? null : role)}
                className={`border-secondary/20 cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="pt-5">
                  <p className="text-xs text-muted-foreground uppercase">{label}</p>
                  <p className="text-3xl font-bold mt-1">{roleCount(role)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Prefix: <span className="font-mono">{prefix}</span></p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>{listTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-10">Loading staff...</p>
            ) : visibleUsers.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">No staff found</p>
            ) : (
              <div className="space-y-3">
                {visibleUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-sm text-muted-foreground">{u.staffId}</p>
                    </div>
                    <Badge className={ROLE_COLORS[u.role]}>{u.role}</Badge>
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