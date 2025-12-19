# Bus Operator App

A modern web application for bus operators to manage routes, bookings, and pricing. Built with Next.js, TypeScript, Tailwind CSS, and Firebase Firestore.

## Features

- **Dashboard**: View and manage buses, bookings, and search functionality
- **Route Management**: Add new bus routes with origin, destination, seats, and pricing
- **Booking System**: Search for buses, select seats, and make bookings
- **Pricing Management**: Update route prices dynamically
- **Real-time Updates**: All data syncs in real-time using Firebase Firestore

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Icons**: Lucide React
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sahilraj3019/bus-operator-app.git
   cd bus-operator-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Dashboard (/)**: Main interface for managing buses and bookings
- **Routes (/routes)**: Manage route pricing and view all bus routes

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

Deploy to Vercel or any platform supporting Next.js:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is private and proprietary.
