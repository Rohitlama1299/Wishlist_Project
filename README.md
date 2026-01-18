# Wishlist Travel

A full-stack web application for managing travel wishlists, destinations, and activities. Users can create accounts, explore destinations, add activities to their wishlists, and manage their travel plans.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Destination Management**: Browse and manage travel destinations by continents, countries, and cities
- **Activity Planning**: Create and organize activities for each destination
- **Photo Uploads**: Upload and manage photos for destinations and activities
- **Responsive Frontend**: Modern Angular-based user interface
- **RESTful API**: Robust NestJS backend with TypeORM and PostgreSQL

## Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class-validator
- **File Upload**: Multer

### Frontend
- **Framework**: Angular
- **Language**: TypeScript
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient with interceptors

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohitlama1299/Wishlist_Project.git
   cd Wishlist_Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and configure your database connection and JWT secret

   ```bash
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ng serve
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Destinations
- `GET /destinations` - Get all destinations
- `POST /destinations` - Create a new destination
- `GET /destinations/:id` - Get destination by ID
- `PUT /destinations/:id` - Update destination
- `DELETE /destinations/:id` - Delete destination

### Activities
- `GET /activities` - Get all activities
- `POST /activities` - Create a new activity
- `GET /activities/:id` - Get activity by ID
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity

### Locations
- `GET /locations` - Get all locations (cities)
- `POST /locations` - Create a new city

### Photos
- `GET /photos` - Get all photos
- `POST /photos` - Upload a new photo

## Project Structure

```
Wishlist_Travel/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── activities/      # Activities module
│   │   ├── auth/           # Authentication module
│   │   ├── destinations/   # Destinations module
│   │   ├── entities/       # Database entities
│   │   ├── locations/      # Locations module
│   │   ├── photos/         # Photos module
│   │   └── users/          # Users module
│   ├── test/               # E2E tests
│   └── uploads/            # File uploads directory
├── frontend/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Core services and guards
│   │   │   ├── features/   # Feature modules
│   │   │   ├── models/     # TypeScript interfaces
│   │   │   └── shared/     # Shared components
│   └── assets/             # Static assets
└── README.md
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
ng build --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Rohit Lama - Rohitlama1299@gmail.com

Project Link: [https://github.com/Rohitlama1299/Wishlist_Project](https://github.com/Rohitlama1299/Wishlist_Project)
