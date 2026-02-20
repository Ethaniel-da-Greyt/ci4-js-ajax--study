export async function fetchTasksApi(search = "", filter = "", page = 1) {
  const res = await fetch(
    `/todo/fetch-all?search=${search}&status=${filter}&page=${page}`,
  );
  return await res.json();
}

export async function fetchByIdApi(id = 1) {
  const res = await fetch(`/todo/update-fetch/${id}`);
  return await res.json();
}

export async function storeTasks(tasks) {
  const res = await fetch(`/todo/save-task-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: tasks }),
  });

  return await res.json();
}

export async function deleteCheckedApi(ids) {
  const res = await fetch(`todo/delete-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  return await res.json();
}

export async function addTasksApi(tasks) {
  const res = await fetch(`/todo/save-task-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });

  return await res.json();
}

export async function markDoneApi(ids) {
  const res = await fetch(`/todo/mark-done-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: ids }),
  });

  return await res.json();
}

export async function updateApi(id, task) {
  const res = await fetch(`/todo/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  return await res.json();
}
