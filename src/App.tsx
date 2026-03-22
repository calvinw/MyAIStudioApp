import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Calendar, 
  Tag, 
  AlertCircle,
  ChevronRight,
  Search,
  X,
  Edit2
} from "lucide-react";
import { Todo, Priority, Category, TodoFilter } from "./types";
import { CATEGORIES, PRIORITIES } from "./constants";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("protasker_todos");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState<TodoFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    localStorage.setItem("protasker_todos", JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === "ACTIVE") return !todo.completed;
        if (filter === "COMPLETED") return todo.completed;
        return true;
      })
      .filter((todo) => 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by priority first, then by date
        const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, filter, searchQuery]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setTitle("");
    setDescription("");
    setPriority(Priority.MEDIUM);
    setCategory(Category.PERSONAL);
    setDueDate("");
    setErrors({});
    setIsEditorOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority);
    setCategory(todo.category);
    setDueDate(todo.dueDate || "");
    setErrors({});
    setIsEditorOpen(true);
  };

  const handleSaveTodo = () => {
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    if (editingTodo) {
      setTodos(todos.map(t => t.id === editingTodo.id ? {
        ...t,
        title,
        description,
        priority,
        category,
        dueDate
      } : t));
    } else {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        priority,
        category,
        dueDate,
        createdAt: new Date().toISOString()
      };
      setTodos([newTodo, ...todos]);
    }
    setIsEditorOpen(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">ProTasker</h1>
          </div>
          
          <button 
            onClick={handleAddTodo}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
            {(["ALL", "ACTIVE", "COMPLETED"] as TodoFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f 
                    ? "bg-stone-900 text-white shadow-sm" 
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group bg-white border border-stone-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4 ${
                    todo.completed ? "opacity-60" : ""
                  }`}
                >
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-0.5 transition-colors ${
                      todo.completed ? "text-emerald-600" : "text-stone-300 hover:text-stone-400"
                    }`}
                  >
                    {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium truncate ${todo.completed ? "line-through text-stone-400" : ""}`}>
                        {todo.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        CATEGORIES.find(c => c.value === todo.category)?.color
                      }`}>
                        {todo.category}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        PRIORITIES.find(p => p.value === todo.priority)?.iconColor
                      }`} />
                    </div>
                    
                    {todo.description && (
                      <p className="text-sm text-stone-500 line-clamp-2 mb-2">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-stone-400 font-medium">
                      {todo.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Tag size={12} />
                        <span>{todo.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditTodo(todo)}
                      className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                  <Filter size={32} />
                </div>
                <h3 className="text-stone-900 font-medium mb-1">No tasks found</h3>
                <p className="text-stone-500 text-sm">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {editingTodo ? "Edit Task" : "New Task"}
                </h2>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className={`w-full px-4 py-2.5 bg-stone-50 border ${
                      errors.title ? "border-red-500" : "border-stone-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
                  />
                  {errors.title && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Priority</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                    >
                      {PRIORITIES.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input 
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-stone-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTodo}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg active:scale-95"
                >
                  {editingTodo ? "Update Task" : "Create Task"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Empty State Footer */}
      {todos.length > 0 && (
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-stone-400 text-xs font-medium uppercase tracking-widest">
          {todos.filter(t => t.completed).length} of {todos.length} tasks completed
        </footer>
      )}
    </div>
  );
}
