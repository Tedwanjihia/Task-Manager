// src/store.js
import { Task } from "./Task.js";

const STORAGE_KEY = "modular-tasks:v1";

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    // convert to Task instances and validate
    return Array.isArray(arr) ? arr.map(item => new Task(item)) : [];
  } catch (e) {
    console.error("Failed to load tasks:", e);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    // accept array of Task instances or plain objects
    const plain = tasks.map(t => (t.toJSON ? t.toJSON() : t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}
