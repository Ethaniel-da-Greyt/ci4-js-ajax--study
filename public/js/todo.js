let currentPage = 1;
let totalPages = 1;

function renderPagination(total) {
  totalPages = total;
  let html = "";

  // Previous
  html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
               <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a>
           </li>`;

  // Page numbers
  for (let page = 1; page <= totalPages; page++) {
    html += `<li class="page-item ${page === currentPage ? "active" : ""}">
                  <a class="page-link" href="#" onclick="goToPage(${page})">${page}</a>
              </li>`;
  }

  // Next
  html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
               <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
           </li>`;

  document.getElementById("pagination").innerHTML = html;
}

function goToPage(page) {
  if (page < 1 || page > totalPages) return;

  currentPage = page;

  loadTasks();
}

async function loadTasks() {
  try {
    let search = document.getElementById("searchInput").value;
    let status = document.getElementById("statusFilter").value;

    const response = await fetch(
      `/todo/fetch-all?search=${search}&status=${status}&page=${currentPage}`,
    );
    const res = await response.json();

    if (!response.ok) {
      throw new Error("Network Response not Okay");
    }

    const tbody = document.getElementById("taskTable");
    tbody.innerHTML = "";

    res.data.forEach((task) => {
      const tr = document.createElement("tr");
      tr.setAttribute("id", "row-" + task.id);
      let statusBadge =
        task.is_done == 0
          ? `<span class="badge text-bg-danger">Not Done</span>`
          : `<span class="badge text-bg-success">Done</span>`;

      tr.innerHTML = `<td><input type="checkbox" class="task-checkbox" value="${task.id}"></td>
                        <td>${task.id}</td>
                        <td>${task.task}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button onclick="deleteTask(${task.id})" class="btn btn-danger">Delete</button>
                            <button onclick="openUpdateModal(${task.id})" class="btn btn-info">Update</button>
                        </td>`;

      tbody.appendChild(tr);
    });

    renderPagination(res.total_pages);
    document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", checkBox);
    });

    checkBox();
  } catch (error) {
    console.error('Failed to load the tasks: ', error);
    Swal.fire('success', 'Failed to load Tasks', 'error');
  }
}

function checkBox() {
  const checkB = document.querySelectorAll(".task-checkbox:checked");

  // const hideBtn = document.querySelectorAll('#markDoneBtn #deleteCheckBtn');
  // const markBtn = document.getElementById('markDoneBtn');
  // const deleteBulk = document.getElementById('deleteCheckBtn');

  const checkBtnOpt = document.querySelector(".check-options");

  checkB.length === 0
    ? checkBtnOpt.classList.add("d-none")
    : checkBtnOpt.classList.remove("d-none");
}

function markDone() {
  const checkboxes = document.querySelectorAll(".task-checkbox:checked");
  if (checkboxes.length === 0) {
    Swal.fire({
      title: "Oops!",
      text: "Please select at least one task.",
      icon: "warning",
    });
    return;
  }

  const ids = Array.from(checkboxes).map((cb) => cb.value);

  Swal.fire({
    title: "Are you sure?",
    text: `You are about to mark ${ids.length} task(s) as done.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, mark done!",
  }).then((res) => {
    if (res.isConfirmed) {
      fetch("/todo/mark-done-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: ids,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == "success") {
            Swal.fire({
              title: "Success",
              text: "Task(s) has been marked as done",
              icon: "success",
            });

            loadTasks();
          } else {
            Swal.fire({
              title: "Failed",
              text: "Task(s) failed to mark as done",
              icon: "error",
            });
          }
        });
    }
  });
}

function deleteChecked() {
  const checkboxDelete = document.querySelectorAll(".task-checkbox:checked");
  if (checkboxDelete.length === 0) {
    Swal.fire({
      title: "Oops!",
      text: "Please select at least one task.",
      icon: "warning",
    });
    return;
  }

  const deleteIds = Array.from(checkboxDelete).map((cb) => cb.value);

  Swal.fire({
    title: "Are you sure?",
    text: `You are about to mark ${deleteIds.length} task(s) as done.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete it!",
  }).then((res) => {
    if (res.isConfirmed) {
      fetch("/todo/delete-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: deleteIds,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            Swal.fire({
              title: "Deleted!",
              text: "Task(s) deleted successfully!",
              icon: "success",
            });

            loadTasks();
          } else {
            Swal.fire({
              title: "Failed!",
              text: "Task(s) failed to delete!",
              icon: "error",
            });
          }
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateBtn").addEventListener("click", () => {
    const updateId = document.getElementById("update-task-id").value;
    const updateTask = document.getElementById("update-input-task").value;

    fetch(`/todo/update/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: updateTask,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          loadTasks();

          let updateModal = document.getElementById("updateModal");
          let modal = bootstrap.Modal.getInstance(updateModal);
          modal.hide();

          Swal.fire({
            title: "Updated!",
            text: "Your task has been updated.",
            icon: "success",
          });
        } else {
          alert(data.message);
        }
      });
  });

  checkBox();
  toggleRemoveBtn();
  loadTasks();
});

function openUpdateModal(id) {
  fetch(`/todo/update-fetch/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "success") {
        // console.log(data);
        document.getElementById("update-task-id").value = data.task.id;
        document.getElementById("update-input-task").value = data.task.task;
      } else {
        alert(data.message);
      }
    });
  let modal = document.getElementById("updateModal");
  const updateModal = new bootstrap.Modal(modal);
  updateModal.show();
}

function addTask() {
  const inputs = document.querySelectorAll(".task-input");
  const tasks = [];

  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      tasks.push(input.value.trim());
    }
  });

  if (tasks.length === 0) {
    Swal.fire("Oops!", "Please enter at least one task.", "warning");
    return;
  }

  fetch("/todo/save-task-bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: tasks,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        Swal.fire("Success", "Task(s) save successfully", "success");
        loadTasks();
        resetTaskForm();
        toggleRemoveBtn();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    });
}

function toggleRemoveBtn() {
  const groups = document.querySelectorAll("#taskInput .input-group");

  groups.forEach((group) => {
    const btn = group.querySelector(".remove-btn");
    btn.style.display = groups.length === 1 ? "none" : "inline-block";
  });
}

function removeTask(btn) {
  btn.closest(".input-group").remove();
  toggleRemoveBtn();
}

function addTaskInput() {
  const container = document.getElementById("taskInput");
  const div = document.createElement("div");
  div.className = "input-group mb-2";

  div.innerHTML = `
            <input type="text" class="form-control task-input" placeholder="Enter your task">
            <button class="btn btn-danger btn-close remove-btn btn-lg" onclick="removeTask(this)"></button>
            `;

  container.appendChild(div);
  toggleRemoveBtn();
}

function resetTaskForm() {
  const container = document.getElementById("taskInput");

  container.innerHTML = `
            <div class="input-group mb-2">
                <input type="text" class="form-control task-input" placeholder="Enter your task">
                <button class="btn btn-danger btn-close remove-btn btn-lg" 
                    onclick="removeTask(this)">
                </button>
            </div>`;

  toggleRemoveBtn();
}

// function markDone(id)
// {
//     Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, mark it done!"

//     }).then(result => {
//         if(result.isConfirmed)
//         {
//             fetch(`/todo/mark-done/${id}`).then(res => res.json()).then(data => {
//                 if(data.status == "success")
//                     {
//                         Swal.fire({
//                             title: "Marked Done!",
//                             text: "Task marked done successfully",
//                             icon: "success",
//                         });
//                         loadTasks();
//                     }else{
//                         Swal.fire({
//                             title: "Error",
//                             text: "Failed to mark done",
//                             icon: "error",
//                         });
//                     }
//             });
//         }
//     });
// }

// function addTask() {
//     let taskValue = document.getElementById('taskInput').value.trim();

//     fetch('/todo/store', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             task: taskValue
//         })

//     }).then(response => response.json()).then(data => {
//         console.log(data);
//         if (data.status === 'success') {
//             document.getElementById('taskInput').value = '';
//             loadTasks();
//         } else {
//             alert(data.message);
//         }
//     })
// }

function deleteTask(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/todo/delete/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            const row = document.getElementById("row-" + data.id);
            if (row) {
              row.remove();
            }
            loadTasks();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Failed to Delete!",
              text: "Task Failed to delete.",
              icon: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Delete failed. Check console for error.");
        });
    }
  });
}

// document.addEventListener('DOMContentLoaded', () => {
//     loadTasks();
// });

let debounce;
document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    currentPage = 1;
    loadTasks();
  }, 300);
});

document.getElementById("statusFilter").addEventListener("change", () => {
  currentPage = 1;
  loadTasks();
});
