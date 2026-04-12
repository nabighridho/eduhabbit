"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Todo } from "@/db/schema";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { TodoFilters } from "./todo-filters";
import styles from "./todo-list.module.css";

type Filter = "all" | "pending" | "done" | "cancelled";

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const t = useTranslations("todos");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTodos = filter === "all" ? todos : todos.filter(item => item.status === filter);

  const handleAdd = async (data: { title: string; description?: string; dueDate?: string }) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos(prev => [newTodo, ...prev]);
      showToast(t("toast.added"));
      setShowForm(false);
    }
  };

  const handleEdit = async (id: string, data: { title: string; description?: string; dueDate?: string }) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(prev => prev.map(item => item.id === id ? updated : item));
      showToast(t("toast.updated"));
      setEditingTodo(null);
    }
  };

  const handleComplete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(prev => prev.map(item => item.id === id ? updated : item));
      showToast(t("toast.completed"));
    }
  };

  const handleCancel = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(prev => prev.map(item => item.id === id ? updated : item));
      showToast(t("toast.cancelled"));
    }
  };

  const handleRestore = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(prev => prev.map(item => item.id === id ? updated : item));
      showToast(t("toast.restored"));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos(prev => prev.filter(item => item.id !== id));
      showToast(t("toast.deleted"));
    }
  };

  return (
    <div className={styles.wrapper}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.topBar}>
        <TodoFilters filter={filter} onFilterChange={setFilter} />
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          + {t("addTask")}
        </button>
      </div>

      <AnimatePresence>
        {(showForm || editingTodo) && (
          <motion.div
            className={styles.formOverlay}
            onClick={() => { setShowForm(false); setEditingTodo(null); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <TodoForm
                todo={editingTodo ?? undefined}
                onSubmit={editingTodo
                  ? (data) => handleEdit(editingTodo.id, data)
                  : handleAdd
                }
                onCancel={() => { setShowForm(false); setEditingTodo(null); }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {filteredTodos.length === 0 ? (
            <motion.div
              key="empty"
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t(`empty.${filter}`)}
            </motion.div>
          ) : (
            filteredTodos.map((todo, i) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.04 }}
                layout
              >
                <TodoItem
                  todo={todo}
                  onComplete={handleComplete}
                  onEdit={setEditingTodo}
                  onCancel={handleCancel}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
