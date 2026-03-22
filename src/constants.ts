import { Category, Priority } from "./types";

export const CATEGORIES = [
  { value: Category.WORK, label: "Work", color: "bg-blue-100 text-blue-700" },
  { value: Category.PERSONAL, label: "Personal", color: "bg-purple-100 text-purple-700" },
  { value: Category.SHOPPING, label: "Shopping", color: "bg-green-100 text-green-700" },
  { value: Category.HEALTH, label: "Health", color: "bg-red-100 text-red-700" },
  { value: Category.OTHER, label: "Other", color: "bg-gray-100 text-gray-700" },
];

export const PRIORITIES = [
  { value: Priority.LOW, label: "Low", color: "text-gray-500", iconColor: "bg-gray-400" },
  { value: Priority.MEDIUM, label: "Medium", color: "text-yellow-600", iconColor: "bg-yellow-500" },
  { value: Priority.HIGH, label: "High", color: "text-red-600", iconColor: "bg-red-500" },
];
