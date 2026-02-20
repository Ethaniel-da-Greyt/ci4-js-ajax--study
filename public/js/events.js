import {
  loadTasks,
  deleteTask,
  openUpdateModal,
  updateSubmit,
  markAsDone,
  submitTasks,
} from "./main.js";

export function attachEvents() {
  const tbody = document.getElementById("taskTable");

  // FOR UPDATE BTN TO TRIGGER MODAL
  document.getElementById("taskTable").addEventListener("click", (e) => {
    if (e.target.classList.contains("updateBtn")) {
      const updateId = e.target.dataset.taskId;
      openUpdateModal(updateId);
    }
  });

  //  FOR CHECKBOX
  document.getElementById("taskTable").addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
      let checkedBox = document.querySelectorAll(".task-checkbox:checked");
      let btnOpt = document.querySelector(".check-options");
      if (!btnOpt) return;

      checkedBox.length === 0
        ? btnOpt.classList.add("d-none")
        : btnOpt.classList.remove("d-none");
    }
  });

  //  FOR UPDATE MODAL BUTTON TO SUBMIT
  document.getElementById("updateBtn").addEventListener("click", () => {
    let taskId = document.getElementById("update-task-id").value;
    let task = document.getElementById("update-input-task").value;
    updateSubmit(taskId, task);
  });

  //   FOR LIVE SEARCH AND DEBOUNCE
  let debounce;
  document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      loadTasks();
    }, 300);
    window.currentPage = 1;
  });

  //   FOR FILTER STATUS
  document.getElementById("statusFilter").addEventListener("change", () => {
    window.currentPage = 1;
    loadTasks();
  });

  //   FOR DELETING TASK(S)
  document.getElementById("deleteCheckBtn").addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll(".task-checkbox:checked");

    if (checkedBoxes.length === 0)
      return Swal.fire("Error", "Please Select Task(s).", "error");

    const ids = Array.from(checkedBoxes).map((checkboxes) => checkboxes.value);
    deleteTask(ids);
  });

  //   FOR MARK AS DONE
  document.getElementById("markDoneBtn").addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll(".task-checkbox:checked");

    if (checkedBoxes.length === 0) {
      return Swal.fire("Error", "Please select task(s) first.", "error");
    }

    const ids = Array.from(checkedBoxes).map((checkbox) => checkbox.value);
    markAsDone(ids);
  });

  //   Add Task Input
  document.getElementById("addTaskBtn").addEventListener("click", () => {
    const container = document.getElementById("taskInput");
    const div = document.createElement("div");
    div.className = "input-group mb-2";
    div.innerHTML = `<input type="text" class="form-control task-input" placeholder="Enter your task">
                        <button class="btn btn-close removeTask-btn"></button>`;
    container.appendChild(div);
    toggleRemoveBtn();
  });

  //   remove btn task input
  document.getElementById("taskInput").addEventListener("click", (e) => {
    if (e.target.classList.contains("removeTask-btn")) {
      e.target.closest(".input-group").remove();
      toggleRemoveBtn();
    }
  });

  //   submit tasks btn
  document.getElementById("submitTasks").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".task-input");
    const tasks = [];
    inputs.forEach((input) => {
      tasks.push(input.value);
    });

    if (tasks.length === 0)
      Swal.fire("Error", "Input your task first.", "error");

    submitTasks(tasks);
  });
}

// ToggleRemove function
export function toggleRemoveBtn() {
  const removeBtn = document.querySelectorAll(".removeTask-btn");

  removeBtn.forEach((btn) => {
    removeBtn.length === 1
      ? btn.classList.add("d-none")
      : btn.classList.remove("d-none");
  });
}
