# ProTasker

ProTasker is a modern, responsive Todo application designed for productivity and ease of use. It features a clean, professional interface with advanced task management capabilities.

## Features

- **Modern Dashboard**: A clean, responsive interface using a "Clean Utility" aesthetic.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) capabilities.
- **Advanced Filtering**: Filter tasks by status (All, Active, Completed) and real-time search.
- **Categorization & Priority**: Color-coded categories (Work, Personal, etc.) and visual priority indicators (Low, Medium, High).
- **Smart Sorting**: Tasks are automatically sorted by priority and then by creation date.
- **Interactive UI**: Smooth animations and layout transitions powered by `motion/react`.
- **Local Persistence**: Tasks are saved to `localStorage`, ensuring data is preserved between sessions.

## Tech Stack

- **React**: Frontend framework.
- **TypeScript**: For type safety and better developer experience.
- **Tailwind CSS**: For modern, utility-first styling.
- **Lucide React**: For consistent and crisp iconography.
- **Motion**: For fluid animations and transitions.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

- **Add Task**: Click the "New Task" button in the header.
- **Edit Task**: Hover over a task and click the pencil icon.
- **Delete Task**: Hover over a task and click the trash icon.
- **Toggle Completion**: Click the circle icon next to the task title.
- **Filter/Search**: Use the search bar and filter buttons at the top of the task list.
