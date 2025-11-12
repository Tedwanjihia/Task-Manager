// src/view.js
import { escapeHTML } from "./utils.js";

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("data-")) node.setAttribute(k, v);
    else node[k] = v;
  });
  children.forEach(c => {
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else if (c instanceof Node) node.appendChild(c);
  });
  return node;
}

export function renderTasks(container, tasks, filter = "all") {
  container.innerHTML = ""; // clear

  const filtered = tasks.filter(t => {
    if (filter === "all") return true;
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  if (filtered.length === 0) {
    container.appendChild(el("li", { class: "task small" }, "No tasks"));
    return;
  }

  for (const t of filtered) {
    const left = el("div", { class: "left" },
      el("div", { class: `checkbox ${t.done ? "done" : ""}`, "data-action": "toggle", "data-id": t.id }, t.done ? "✓" : ""),
      el("div", { class: `title ${t.done ? "done" : ""}`, "data-id": t.id }, escapeHTML(t.title))
    );

    const actions = el("div", {},
      el("button", { class: "btn del", "data-action": "delete", "data-id": t.id, title: "Delete task" }, "🗑")
    );

    const li = el("li", { class: `task ${t.isOverdue ? "overdue":""}`, "data-id": t.id }, left, actions);
    // attach dataset (helpful)
    li.dataset.id = t.id;
    container.appendChild(li);
  }
}

export function renderCounts(countContainer, tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const active = total - completed;
  countContainer.textContent = `${total} total • ${active} active • ${completed} done`;
}

export function setActiveFilter(btnsContainer, filter) {
  for (const b of btnsContainer.querySelectorAll(".filter-btn")) {
    b.classList.toggle("active", b.dataset.filter === filter);
  }
}
