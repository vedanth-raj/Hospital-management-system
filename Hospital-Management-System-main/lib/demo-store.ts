type Role = 'admin' | 'doctor' | 'reception' | 'patient';

type DemoUser = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  phone?: string;
};

type DemoDoctor = {
  id: number;
  userId: number;
  specialization: string;
  licenseNumber: string;
  isAvailable: boolean;
};

type DemoPatient = {
  id: number;
  userId: number;
  patientId: string;
  bloodType?: string;
  allergies?: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

type DemoQueue = {
  id: number;
  doctorId: number;
  patientId: number;
  queuePosition: number;
  priority: 'normal' | 'high' | 'emergency' | 'low';
  status: 'waiting' | 'in-consultation' | 'completed';
  checkInTime: string;
  estimatedWaitTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
};

type DemoAppointment = {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
};

type DemoBed = {
  id: number;
  bedNumber: string;
  ward: string;
  bedType: 'general' | 'icu' | 'pediatric' | 'maternity' | 'isolation';
  floorNumber: number;
  isAvailable: boolean;
  allocatedToPatientId: number | null;
  allocatedAt: string | null;
};

type DemoEmergency = {
  id: number;
  patientId: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedDoctorId: number | null;
  createdAt: string;
};

type DemoStore = {
  users: DemoUser[];
  doctors: DemoDoctor[];
  patients: DemoPatient[];
  queues: DemoQueue[];
  appointments: DemoAppointment[];
  beds: DemoBed[];
  emergencies: DemoEmergency[];
  counters: {
    userId: number;
    doctorId: number;
    patientId: number;
    queueId: number;
    appointmentId: number;
    emergencyId: number;
  };
};

const globalKey = '__healthHubDemoStore__';

function seedStore(): DemoStore {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 1,
        email: 'admin@hospital.com',
        password: 'admin123',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        isActive: true,
        phone: '9000000001',
      },
      {
        id: 2,
        email: 'doctor@hospital.com',
        password: 'doctor123',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'doctor',
        isActive: true,
        phone: '9000000002',
      },
      {
        id: 3,
        email: 'reception@hospital.com',
        password: 'reception123',
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'reception',
        isActive: true,
        phone: '9000000003',
      },
      {
        id: 4,
        email: 'patient@hospital.com',
        password: 'patient123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'patient',
        isActive: true,
        phone: '9000000004',
      },
    ],
    doctors: [
      {
        id: 1,
        userId: 2,
        specialization: 'General Medicine',
        licenseNumber: 'DOC-001',
        isAvailable: true,
      },
    ],
    patients: [
      {
        id: 1,
        userId: 4,
        patientId: 'PAT-4',
        bloodType: 'O+',
        allergies: 'None',
        dateOfBirth: '1997-07-14',
        gender: 'Male',
      },
    ],
    queues: [
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        queuePosition: 1,
        priority: 'normal',
        status: 'waiting',
        checkInTime: now,
        estimatedWaitTimeMinutes: 15,
        createdAt: now,
        updatedAt: now,
      },
    ],
    appointments: [
      {
        id: 1,
        patientId: 1,
        doctorId: 1,
        appointmentDate: new Date().toISOString().slice(0, 10),
        appointmentTime: '10:00',
        reasonForVisit: 'Routine checkup',
        status: 'scheduled',
      },
    ],
    beds: [
      {
        id: 1,
        bedNumber: 'A-101',
        ward: 'General',
        bedType: 'general',
        floorNumber: 1,
        isAvailable: true,
        allocatedToPatientId: null,
        allocatedAt: null,
      },
      {
        id: 2,
        bedNumber: 'ICU-1',
        ward: 'Critical Care',
        bedType: 'icu',
        floorNumber: 2,
        isAvailable: false,
        allocatedToPatientId: 1,
        allocatedAt: now,
      },
      {
        id: 3,
        bedNumber: 'P-22',
        ward: 'Pediatric',
        bedType: 'pediatric',
        floorNumber: 3,
        isAvailable: true,
        allocatedToPatientId: null,
        allocatedAt: null,
      },
    ],
    emergencies: [
      {
        id: 1,
        patientId: 1,
        severity: 'high',
        description: 'Chest pain and breathlessness',
        status: 'in-progress',
        assignedDoctorId: 1,
        createdAt: now,
      },
    ],
    counters: {
      userId: 5,
      doctorId: 2,
      patientId: 2,
      queueId: 2,
      appointmentId: 2,
      emergencyId: 2,
    },
  };
}

function getStore(): DemoStore {
  const globalObj = globalThis as unknown as { [globalKey]?: DemoStore };
  if (!globalObj[globalKey]) {
    globalObj[globalKey] = seedStore();
  }
  return globalObj[globalKey] as DemoStore;
}

export function validateDemoCredentials(email: string, password: string) {
  const store = getStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
}

export function registerDemoUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  userType?: string;
}) {
  const store = getStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) return null;

  const user: DemoUser = {
    id: store.counters.userId++,
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role,
    isActive: true,
  };
  store.users.push(user);

  if (input.role === 'patient') {
    store.patients.push({
      id: store.counters.patientId++,
      userId: user.id,
      patientId: `PAT-${user.id}`,
      allergies: '',
      bloodType: '',
    });
  }

  if (input.role === 'doctor') {
    store.doctors.push({
      id: store.counters.doctorId++,
      userId: user.id,
      specialization: input.userType || 'General Medicine',
      licenseNumber: `DOC-${user.id}`,
      isAvailable: true,
    });
  }

  return user;
}

export function getDemoAuthProfile(userId: number) {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;

  const base = {
    userId: user.id,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
  };

  if (user.role === 'patient') {
    const patient = store.patients.find((p) => p.userId === user.id);
    return { ...base, ...patient };
  }

  if (user.role === 'doctor') {
    const doctor = store.doctors.find((d) => d.userId === user.id);
    return { ...base, ...doctor };
  }

  return base;
}

export function getPatientProfile(userId: number) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  const user = store.users.find((u) => u.id === userId);
  if (!patient || !user) return null;

  return {
    patientId: patient.patientId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    dateOfBirth: patient.dateOfBirth || '',
    gender: patient.gender || '',
    bloodType: patient.bloodType || '',
    allergies: patient.allergies || '',
    medicalHistory: patient.medicalHistory || '',
    emergencyContactName: patient.emergencyContactName || '',
    emergencyContactPhone: patient.emergencyContactPhone || '',
    address: patient.address || '',
    city: patient.city || '',
    state: patient.state || '',
    zipCode: patient.zipCode || '',
  };
}

export function updatePatientProfile(userId: number, data: any) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  const user = store.users.find((u) => u.id === userId);
  if (!patient || !user) return false;

  patient.dateOfBirth = data.dateOfBirth || patient.dateOfBirth;
  patient.gender = data.gender || patient.gender;
  patient.bloodType = data.bloodType || patient.bloodType;
  patient.allergies = data.allergies || patient.allergies;
  patient.medicalHistory = data.medicalHistory || patient.medicalHistory;
  patient.emergencyContactName = data.emergencyContactName || patient.emergencyContactName;
  patient.emergencyContactPhone = data.emergencyContactPhone || patient.emergencyContactPhone;
  patient.address = data.address || patient.address;
  patient.city = data.city || patient.city;
  patient.state = data.state || patient.state;
  patient.zipCode = data.zipCode || patient.zipCode;
  user.phone = data.phone || user.phone;

  return true;
}

export function getPatientQueueStatus(userId: number) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  if (!patient) return null;

  const queue = [...store.queues]
    .filter((q) => q.patientId === patient.id && q.status !== 'completed')
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0];

  if (!queue) {
    return {
      queuePosition: null,
      message: 'Not currently in any queue',
    };
  }

  const doctor = store.doctors.find((d) => d.id === queue.doctorId);
  const doctorUser = doctor ? store.users.find((u) => u.id === doctor.userId) : null;

  return {
    queuePosition: queue.queuePosition,
    status: queue.status,
    doctorName: doctorUser ? `${doctorUser.firstName} ${doctorUser.lastName}` : 'Doctor',
    specialization: doctor?.specialization || 'General Medicine',
    estimatedWaitTime: queue.estimatedWaitTimeMinutes,
    priority: queue.priority,
    checkInTime: queue.checkInTime,
  };
}

export function joinQueueForPatient(userId: number, doctorId: number, priority: DemoQueue['priority']) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  if (!patient) return null;

  const activeForDoctor = store.queues.filter(
    (q) => q.doctorId === doctorId && q.status !== 'completed'
  );
  const nextPosition = activeForDoctor.length + 1;
  const now = new Date().toISOString();

  const item: DemoQueue = {
    id: store.counters.queueId++,
    doctorId,
    patientId: patient.id,
    queuePosition: nextPosition,
    priority,
    status: 'waiting',
    checkInTime: now,
    estimatedWaitTimeMinutes: nextPosition * 10,
    createdAt: now,
    updatedAt: now,
  };

  store.queues.push(item);
  return item;
}

export function getPatientAppointments(userId: number) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  if (!patient) return [];

  return store.appointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => (a.appointmentDate > b.appointmentDate ? -1 : 1))
    .map((apt) => {
      const doctor = store.doctors.find((d) => d.id === apt.doctorId);
      const doctorUser = doctor ? store.users.find((u) => u.id === doctor.userId) : null;
      return {
        id: apt.id,
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        doctorName: doctorUser ? `${doctorUser.firstName} ${doctorUser.lastName}` : 'Doctor',
        specialization: doctor?.specialization || 'General Medicine',
        reason: apt.reasonForVisit,
        status: apt.status,
      };
    });
}

export function createPatientAppointment(
  userId: number,
  input: { doctorId?: number; appointmentDate: string; appointmentTime: string; reasonForVisit: string }
) {
  const store = getStore();
  const patient = store.patients.find((p) => p.userId === userId);
  if (!patient) return null;

  const doctorId = input.doctorId || store.doctors[0]?.id;
  if (!doctorId) return null;

  const item: DemoAppointment = {
    id: store.counters.appointmentId++,
    patientId: patient.id,
    doctorId,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    reasonForVisit: input.reasonForVisit,
    status: 'scheduled',
  };
  store.appointments.push(item);
  return item;
}

export function getReceptionQueues() {
  const store = getStore();
  return store.queues
    .filter((q) => q.status === 'waiting' || q.status === 'in-consultation')
    .sort((a, b) => b.priority.localeCompare(a.priority) || a.queuePosition - b.queuePosition)
    .map((q) => {
      const patient = store.patients.find((p) => p.id === q.patientId);
      const patientUser = patient ? store.users.find((u) => u.id === patient.userId) : null;
      const doctor = store.doctors.find((d) => d.id === q.doctorId);
      const doctorUser = doctor ? store.users.find((u) => u.id === doctor.userId) : null;

      return {
        id: q.id,
        position: q.queuePosition,
        patientName: patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : 'Unknown',
        patientId: patient?.patientId || 'NA',
        doctorName: doctorUser ? `${doctorUser.firstName} ${doctorUser.lastName}` : 'Doctor',
        priority: q.priority,
        status: q.status,
        checkInTime: q.checkInTime,
      };
    });
}

export function addQueueByReception(patientId: number, doctorId: number, priority: DemoQueue['priority']) {
  const store = getStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) return null;

  const nextPosition =
    store.queues.filter((q) => q.doctorId === doctorId && q.status !== 'completed').length + 1;
  const now = new Date().toISOString();

  const item: DemoQueue = {
    id: store.counters.queueId++,
    doctorId,
    patientId,
    queuePosition: nextPosition,
    priority,
    status: 'waiting',
    checkInTime: now,
    estimatedWaitTimeMinutes: nextPosition * 10,
    createdAt: now,
    updatedAt: now,
  };

  store.queues.push(item);
  return item;
}

export function getDoctorQueue(userId: number) {
  const store = getStore();
  const doctor = store.doctors.find((d) => d.userId === userId);
  if (!doctor) return [];

  return store.queues
    .filter((q) => q.doctorId === doctor.id && (q.status === 'waiting' || q.status === 'in-consultation'))
    .sort((a, b) => a.queuePosition - b.queuePosition)
    .map((q) => {
      const patient = store.patients.find((p) => p.id === q.patientId);
      const patientUser = patient ? store.users.find((u) => u.id === patient.userId) : null;
      return {
        id: q.id,
        position: q.queuePosition,
        patientName: patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : 'Unknown',
        patientId: patient?.patientId || 'NA',
        priority: q.priority,
        status: q.status,
        estimatedWaitTime: q.estimatedWaitTimeMinutes,
      };
    });
}

export function updateDoctorQueue(queueId: number, status: DemoQueue['status']) {
  const store = getStore();
  const queue = store.queues.find((q) => q.id === queueId);
  if (!queue) return false;
  queue.status = status;
  queue.updatedAt = new Date().toISOString();
  return true;
}

export function getBeds() {
  const store = getStore();
  return store.beds.map((bed) => {
    const patient = bed.allocatedToPatientId
      ? store.patients.find((p) => p.id === bed.allocatedToPatientId)
      : null;
    const user = patient ? store.users.find((u) => u.id === patient.userId) : null;
    return {
      id: bed.id,
      bedNumber: bed.bedNumber,
      ward: bed.ward,
      bedType: bed.bedType,
      floor: bed.floorNumber,
      isAvailable: bed.isAvailable,
      allocatedPatient: patient && user
        ? { id: patient.id, name: `${user.firstName} ${user.lastName}`, patientId: patient.patientId }
        : null,
      allocatedAt: bed.allocatedAt,
    };
  });
}

export function updateBedAllocation(bedId: number, allocatedToPatientId: number | null, isAvailable: boolean) {
  const store = getStore();
  const bed = store.beds.find((b) => b.id === bedId);
  if (!bed) return false;
  bed.allocatedToPatientId = allocatedToPatientId;
  bed.isAvailable = isAvailable;
  bed.allocatedAt = allocatedToPatientId ? new Date().toISOString() : null;
  return true;
}

export function getDashboardStats() {
  const store = getStore();
  return {
    visitsTodayCount: 120 + store.appointments.length,
    appointmentsTodayCount: store.appointments.filter((a) => a.status === 'scheduled').length,
    emergencyCasesToday: store.emergencies.filter((e) => e.status !== 'resolved').length,
    totalBeds: store.beds.length,
    availableBeds: store.beds.filter((b) => b.isAvailable).length,
    patientsInQueue: store.queues.filter((q) => q.status !== 'completed').length,
    doctorsOnDuty: store.doctors.filter((d) => d.isAvailable).length,
    totalPatients: store.patients.length,
  };
}

export function getAdminDoctors() {
  const store = getStore();
  return store.doctors.map((doc) => {
    const user = store.users.find((u) => u.id === doc.userId);
    const queueLoad = store.queues.filter((q) => q.doctorId === doc.id && q.status !== 'completed').length;
    return {
      id: doc.id,
      name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      email: user?.email || '',
      specialization: doc.specialization,
      licenseNumber: doc.licenseNumber,
      isAvailable: doc.isAvailable,
      queueLoad,
    };
  });
}

export function getAdminPatients() {
  const store = getStore();
  return store.patients.map((patient) => {
    const user = store.users.find((u) => u.id === patient.userId);
    const lastAppointment = [...store.appointments]
      .filter((a) => a.patientId === patient.id)
      .sort((a, b) => (a.appointmentDate > b.appointmentDate ? -1 : 1))[0];
    return {
      id: patient.id,
      patientId: patient.patientId,
      name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      email: user?.email || '',
      bloodType: patient.bloodType || 'NA',
      allergies: patient.allergies || 'None',
      lastAppointmentDate: lastAppointment?.appointmentDate || null,
    };
  });
}

export function getEmergencyCases() {
  const store = getStore();
  return store.emergencies.map((e) => {
    const patient = store.patients.find((p) => p.id === e.patientId);
    const patientUser = patient ? store.users.find((u) => u.id === patient.userId) : null;
    const doctor = e.assignedDoctorId ? store.doctors.find((d) => d.id === e.assignedDoctorId) : null;
    const doctorUser = doctor ? store.users.find((u) => u.id === doctor.userId) : null;
    return {
      id: e.id,
      patientName: patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : 'Unknown',
      patientId: patient?.patientId || 'NA',
      severity: e.severity,
      description: e.description,
      status: e.status,
      assignedDoctor: doctorUser ? `${doctorUser.firstName} ${doctorUser.lastName}` : 'Unassigned',
      createdAt: e.createdAt,
    };
  });
}

export function updateEmergencyStatus(caseId: number, status: DemoEmergency['status']) {
  const store = getStore();
  const emergency = store.emergencies.find((e) => e.id === caseId);
  if (!emergency) return false;
  emergency.status = status;
  return true;
}
