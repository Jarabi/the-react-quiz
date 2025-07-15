# React Quiz App

An interactive quiz application built with React and Vite that tests your knowledge of React fundamentals. The app features carefully crafted questions about React concepts, state management, hooks, and best practices.

## Features

- **Interactive Quiz Interface** - Clean, responsive UI for taking quizzes
- **Question Categories** - Filter questions by topics like "Fundamentals", "Components & Props", "State & Events", "Effects & Lifecycle", "Performance & Advanced", "State Management", and "Advanced Hooks"
- **Answer Review System** - Review all your answers after completing the quiz with navigation between questions
- **Persistent High Score** - High scores are saved to and retrieved from the JSON server API
- **Timed Questions** - 30 seconds per question with automatic quiz completion on timeout
- **Point-based Scoring** - Different questions carry different point values
- **Context API State Management** - Centralized state management using React Context to avoid prop drilling
- **Questions served from JSON Server** - Local API for quiz data and high score persistence
- **Built with React 19 and Vite** - Modern tooling for optimal performance

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the JSON server (serves quiz questions):
```bash
npm run server
```

2. In a new terminal, start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Development Scripts

- `npm run dev` - Start the development server
- `npm run server` - Start the JSON server (quiz data)

## Tech Stack

- React 19
- Vite 6
- JSON Server
- ESLint for code quality

## License

This project is part of the Ultimate React Course by Jonas Schmedtmann.
