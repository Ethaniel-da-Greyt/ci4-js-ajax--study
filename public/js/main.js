import * as API from "./api.js";
import * as UI from "./ui.js";
import { attachEvents, toggleRemoveBtn } from "./events.js";

window.currentPage = 1;

// LOAD ALL TASK DATA
export async function loadTasks() {
  const search = document.getElementById("searchInput").value;
  const filter = document.getElementById("statusFilter").value;

  try {
    const response = await API.fetchTasksApi(
      search,
      filter,
      window.currentPage,
    );
    if (response.data.status == "error")
      Swal.fire("Error", response.data.message, "error");

    UI.renderTasks(response.data);
    UI.renderPagination(response.total_pages);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }

  toggleRemoveBtn();
  //   attachEvents();
}

// FOR DELETE API
export async function deleteTask(ids) {
  try {
    const res = await API.deleteCheckedApi(ids);
    if (res.status != "success") {
      Swal.fire("Error", res.message, "error");
    }
    loadTasks();
    Swal.fire("Success", res.message, "success");
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

// FOR MARK AS DONE API
export async function markAsDone(ids) {
  try {
    const res = await API.markDoneApi(ids);
    if (res.status === "error") return Swal.fire("Error", res.message, "error");
    Swal.fire("Success", res.message, "success");
    loadTasks();
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

// FOR ADDING VALUE BY ID IN MODAL
export async function openUpdateModal(id) {
  try {
    const res = await API.fetchByIdApi(id);
    if (res.status == "error") Swal.fire("Error", res.message, "error");

    document.getElementById("update-task-id").value = res.task.id;
    document.getElementById("update-input-task").value = res.task.task;

    let modal = document.getElementById("updateModal");
    const updateModal = new bootstrap.Modal(modal);
    updateModal.show();
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

// FOR UPDATE SUBMIT API
export async function updateSubmit(id, task) {
  try {
    const res = await API.updateApi(id, task);
    if (res.status === "error") Swal.fire("Error", res.message, "error");
    let updateModal = document.getElementById("updateModal");
    let modal = bootstrap.Modal.getInstance(updateModal);
    modal.hide();

    loadTasks();
    Swal.fire("Success", res.message, "success");
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

function resetForm() {
  const taskInput = document.getElementById("taskInput");
  taskInput.innerHTML = `<div class="input-group mb-2">
                        <input type="text" class="form-control task-input" placeholder="Enter your task">
                        <button class="btn btn-close removeTask-btn"></button>
                    </div>`;
}
// FOR SUBMITTING TASKS
export async function submitTasks(tasks) {
  try {
    const res = await API.storeTasks(tasks);

    if (res.status === "error") Swal.fire("Error", res.message, "error");
    Swal.fire("Success", res.message, "success");
    resetForm();
    loadTasks();
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

// LOAD LOADTASK FUNCTION
document.addEventListener("DOMContentLoaded", () => {
  attachEvents();
  loadTasks();
});
