export function renderTasks(tasks) {
  const tbody = document.getElementById("taskTable");
  tbody.innerHTML = "";

  if (tasks.length !== 0) {
    tasks.forEach((task) => {
      let tr = document.createElement("tr");
      tr.setAttribute("id", "row-" + task.id);
      const statusBadge =
        task.is_done == 0
          ? `<span class="badge text-bg-danger">Not Done</span>`
          : `<span class="badge text-bg-success">Done</span>`;

      tr.innerHTML = `<td><input type="checkbox" class="task-checkbox" value="${task.id}"></td>
                        <td>${task.id}</td>
                        <td>${task.task}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button data-task-id="${task.id}" class="btn btn-info updateBtn">Update</button>
                        </td>`;
      tbody.appendChild(tr);
    });
  } else {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5"><p>No Task found.</p></td>`;

    tbody.appendChild(tr);
  }
}

export function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === window.currentPage ? "active" : ""}`;

    const button = document.createElement("button");
    button.className = "page-link";
    button.textContent = i;
    button.dataset.page = i;

    li.appendChild(button);
    pagination.appendChild(li);
  }
}
