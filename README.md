# Smart Hospital Management System

A comprehensive, modern hospital management system built with Next.js, React, and Firebase. This application streamlines hospital operations including patient management, doctor scheduling, bed allocation, emergency response, billing, and administrative functions.

## 🏥 Overview

HealthHub is an intelligent hospital management platform designed to optimize hospital workflows and improve patient care delivery. The system supports multiple user roles including administrators, doctors, patients, receptionists, and emergency drivers.

## ✨ Key Features

### Patient Management
- Patient registration and profile management
- Appointment scheduling and tracking
- Medical history and records management
- Bed allocation and history tracking
- Discharge management

### Doctor Management
- Doctor profile and schedule management
- Emergency response coordination
- Patient queue management
- Prescription management
- Analytics and performance tracking

### Emergency Services
- Emergency request handling
- Real-time emergency status tracking
- Driver assignment and coordination
- Emergency response analytics

### Administrative Functions
- User management and role-based access control
- Bed management and occupancy tracking
- Billing and payment processing
- System analytics and reporting
- Patient data management

### Billing System
- Invoice generation
- Payment tracking
- Billing dashboard
- Financial reporting

## 🔄 Complete Workflow

### 1. **User Authentication & Authorization**
   - User login/registration with role-based access
   - Password management and security
   - Session management
   - Multi-role support (Admin, Doctor, Patient, Reception, Driver)

### 2. **Patient Onboarding**
   - Patient registration through reception
   - Initial health assessment
   - Bed assignment
   - Medical record creation

### 3. **Appointment Management**
   - Patient books appointment with available doctor
   - Doctor receives appointment notification
   - Queue management for walk-in patients
   - Appointment status tracking

### 4. **Doctor Consultation**
   - Doctor reviews patient queue
   - Consultation notes and diagnosis
   - Prescription generation
   - Follow-up scheduling

### 5. **Emergency Response**
   - Patient initiates emergency request
   - System alerts available drivers
   - Driver accepts and navigates to patient
   - Real-time status updates
   - Patient transported to hospital

### 6. **Bed Management**
   - Automatic bed allocation based on availability
   - Bed status tracking (occupied, available, maintenance)
   - Patient bed history maintenance
   - Discharge and bed release

### 7. **Billing & Discharge**
   - Automatic billing based on services rendered
   - Invoice generation and payment processing
   - Patient discharge process
   - Medical records archival

### 8. **Administrative Oversight**
   - Real-time analytics and dashboards
   - User management
   - System configuration
   - Report generation

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Styling**: Tailwind CSS with custom animations

## 📋 Project Structure

```
Hospital-Management-System-main/
├── app/
│   ├── admin/              # Admin dashboard and management pages
│   ├── api/                # API routes for all operations
│   ├── auth/               # Authentication pages
│   ├── doctor/             # Doctor portal
│   ├── driver/             # Driver app
│   ├── patient/            # Patient portal
│   └── reception/          # Reception desk interface
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── hooks/                  # Custom React hooks
├── styles/                 # Global styles
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project setup
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hospital-Management-System-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials and configuration
   ```

4. **Initialize Firebase (optional)**
   ```bash
   npm run firebase:bootstrap
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server with webpack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run firebase:bootstrap` - Initialize Firestore database

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Database Configuration
DATABASE_URL=your_database_url

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile

### Patient Management
- `GET/POST /api/admin/patients` - Manage patients
- `GET/POST /api/patient/appointments` - Manage appointments
- `GET /api/patient/bed-history` - Get bed history
- `POST /api/discharge` - Process discharge

### Doctor Management
- `GET/POST /api/admin/doctors` - Manage doctors
- `GET /api/doctor/queue` - Get patient queue
- `POST /api/doctor/emergency-response` - Handle emergency

### Emergency Services
- `POST /api/emergency/request` - Create emergency request
- `GET /api/emergency/status` - Get emergency status
- `GET/POST /api/driver/emergency` - Driver emergency operations

### Billing
- `GET/POST /api/billing` - Billing operations
- `GET /api/admin/billing/dashboard` - Billing dashboard

### Administrative
- `GET /api/admin/stats` - System statistics
- `GET/POST /api/admin/beds` - Bed management
- `GET/POST /api/admin/users` - User management
- `GET/POST /api/admin/emergency` - Emergency management

## 🎯 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- Analytics and reporting

### Doctor
- View patient queue
- Manage appointments
- Write prescriptions
- Emergency response

### Patient
- Book appointments
- View medical records
- Request emergency services
- Manage profile

### Reception
- Register new patients
- Manage patient queue
- Assign beds
- Process admissions

### Driver
- View emergency requests
- Update emergency status
- Navigate to patient location
- Complete emergency transport

## 🧪 Testing

The project includes comprehensive testing setup. Run tests with:

```bash
npm test
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security Features

- Role-based access control (RBAC)
- Password hashing with bcryptjs
- Firebase authentication
- Secure API endpoints
- Input validation with Zod
- CORS protection

## 📊 Analytics & Reporting

- Real-time dashboard metrics
- Patient statistics
- Doctor performance tracking
- Emergency response analytics
- Billing reports
- System health monitoring

## 🚢 Deployment

### Docker Deployment
```bash
docker build -t hospital-management .
docker run -p 3000:3000 hospital-management
```

### AWS Deployment
- EC2 deployment scripts included
- CloudFront CDN configuration
- S3 bucket setup for static assets
- AppRunner configuration available

### Vercel Deployment
```bash
vercel deploy
```

## 📝 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - Component library configuration

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@healthhub.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] AI-powered diagnosis assistance
- [ ] Advanced analytics and ML insights
- [ ] Multi-hospital support
- [ ] Insurance integration
- [ ] Prescription delivery service
- [ ] Patient health monitoring devices integration

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub]

---

**Last Updated**: April 2026
**Version**: 0.1.0
