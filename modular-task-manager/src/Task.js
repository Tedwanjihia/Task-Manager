// src/Task.js
import { uid } from "./utils.js";

export class Task {
  constructor({ id = uid(), title = "", done = false } = {}) {
    this.id = String(id);
    this.title = Task.sanitizeTitle(title);
    this.done = Boolean(done);
  }

  static sanitizeTitle(title) {
    if (typeof title !== "string") return "";
    // keep it short and trim whitespace
    return title.trim().slice(0, 300);
  }

  toggle() {
    this.done = !this.done;
  }

  updateTitle(newTitle) {
    this.title = Task.sanitizeTitle(newTitle);
  }

  toJSON() {
    // used by JSON.stringify
    return { id: this.id, title: this.title, done: this.done };
  }
}
