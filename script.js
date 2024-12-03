// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.setAttribute("draggable", "true"); // Make element draggable
    p.setAttribute("data-index", index); // Store the index for drag and drop
    p.innerHTML = `
      <div class="todo-container">
        <div class="drag-handle">☰</div>
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;

    // Add drag and drop event listeners
    p.addEventListener("dragstart", handleDragStart);
    p.addEventListener("dragover", handleDragOver);
    p.addEventListener("drop", handleDrop);
    p.addEventListener("dragenter", handleDragEnter);
    p.addEventListener("dragleave", handleDragLeave);

    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);
  });
  todoCount.textContent = todo.length;
}

// Drag and drop handlers
let draggedItem = null;
let draggedItemIndex = null;

function handleDragStart(e) {
  draggedItem = this;
  draggedItemIndex = parseInt(this.getAttribute("data-index"));
  this.style.opacity = "0.4";

  // Add visual feedback
  e.dataTransfer.effectAllowed = "move";
  this.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
  this.classList.add("drag-over");
}

function handleDragLeave(e) {
  this.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  if (draggedItem === this) return;

  // Get the index where we're dropping
  const dropIndex = parseInt(this.getAttribute("data-index"));

  // Reorder the todo array
  const itemToMove = todo[draggedItemIndex];
  todo.splice(draggedItemIndex, 1);
  todo.splice(dropIndex, 0, itemToMove);

  // Save and refresh display
  saveToLocalStorage();
  displayTasks();

  // Clear drag state
  this.classList.remove("drag-over");
  draggedItem = null;
  draggedItemIndex = null;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}
