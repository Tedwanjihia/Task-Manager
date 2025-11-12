// src/app.js
import { Task } from "./Task.js";
import * as store from "./store.js";
import * as view from "./view.js";

const selectors = {
  form: "#task-form",
  input: "#new-task",
  list: "#task-list",
  counts: "#counts",
  filters: ".filters"
};

let tasks = [];
let currentFilter = "all";

function load() {
  tasks = store.loadTasks();
}

function save() {
  store.saveTasks(tasks);
}

function addTask(title) {
  const t = new Task({ title });
  tasks.unshift(t); // newest on top
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.toggle();
  save();
  render();
}

function render() {
  const list = document.querySelector(selectors.list);
  const counts = document.querySelector(selectors.counts);
  const filters = document.querySelector(selectors.filters);

  view.renderTasks(list, tasks, currentFilter);
  view.renderCounts(counts, tasks);
  view.setActiveFilter(filters, currentFilter);
}

function setupUI() {
  const form = document.querySelector(selectors.form);
  const input = document.querySelector(selectors.input);
  const list = document.querySelector(selectors.list);
  const filters = document.querySelector(selectors.filters);

  // add
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    addTask(title);
    input.value = "";
    input.focus();
  });

  // event delegation for toggle & delete
  list.addEventListener("click", e => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id || e.target.closest("[data-id]")?.dataset?.id;
    if (!action || !id) return;

    if (action === "toggle") toggleTask(id);
    if (action === "delete") {
      if (confirm("Delete this task?")) deleteTask(id);
    }
  });

  // double-click edit (simple prompt - extension idea)
  list.addEventListener("dblclick", e => {
    const id = e.target.closest("[data-id]")?.dataset?.id;
    if (!id) return;
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const newTitle = prompt("Edit task title:", t.title);
    if (newTitle !== null) {
      t.updateTitle(newTitle);
      save();
      render();
    }
  });

  // filters
  filters.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    render();
  });

  // keyboard shortcut: press "/" to focus input
  document.addEventListener("keydown", e => {
    if (e.key === "/") {
      const inp = document.querySelector(selectors.input);
      if (document.activeElement !== inp) {
        e.preventDefault();
        inp.focus();
      }
    }
  });
}

function init() {
  load();
  setupUI();
  render();
}

// init on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
