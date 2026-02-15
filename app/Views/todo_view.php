<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX PRACTICE</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-3">

        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="card-title">Todo List</h3>
            </div>
        </div>

        <div class="container mt-2 mb-3">
            <input type="text" id="taskInput" class="form-control mb-2" placeholder="Enter Task">
            <button class="btn btn-primary" onclick="addTask()">Add Task</button>
        </div>
        <table class="container table table-striped table-responsive">
            <thead class="table-dark">
                <tr class="text-center">
                    <th></th>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="taskTable" class="text-center">

            </tbody>
        </table>
        <div class="float-end mb-2 d-flex gap-2">
            <button onclick="markDone()" class="btn btn-success">Mark as Done</button>
            <button onclick="deleteChecked()" class="btn btn-danger">Delete Checked Task</button>
        </div>
    </div>

    <div class="modal fade" id="updateModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="modalUpdateTitle"></h4>
                    <button data-bs-dismiss="modal" class="btn-close" type="button"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="update-task-id">
                    <input type="text" id="update-input-task" class="form-control" placeholder="Enter a new Task">
                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary" id="updateBtn">Update</button>
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function loadTasks() {
            fetch('/todo/fetch-all').then(response => response.json()).then(data => {
                const tbody = document.getElementById('taskTable');

                tbody.innerHTML = '';

                data.forEach(task => {
                    const tr = document.createElement('tr');
                    tr.setAttribute('id', 'row-' + task.id);
                    let statusBadge = task.is_done == 0 ? `<span class="badge text-bg-danger">Not Done</span>` : `<span class="badge text-bg-success">Done</span>`
                    // let checkB = task.is_done == 0 ? `<td><input type="checkbox" class="task-checkbox" value="${task.id}"></td>` : '<td></td>';
                    tr.innerHTML = `
                    <td><input type="checkbox" class="task-checkbox" value="${task.id}"></td>
                    <td>${task.id}</td>
                    <td>${task.task}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button onclick="deleteTask(${task.id})" class="btn btn-danger">Delete</button>
                        <button onclick="openUpdateModal(${task.id})" class="btn btn-info">Update</button>
                    </td>
                    `;

                    tbody.appendChild(tr);
                })
            });
        }

        function markDone() {
            const checkboxes = document.querySelectorAll('.task-checkbox:checked');
            if (checkboxes.length === 0) {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Please select at least one task.',
                    icon: 'warning'
                });
                return;
            }

            const ids = Array.from(checkboxes).map(cb => cb.value);

            Swal.fire({
                title: "Are you sure?",
                text: `You are about to mark ${ids.length} task(s) as done.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, mark done!"
            }).then(res => {
                if (res.isConfirmed) {
                    fetch('/todo/mark-done-bulk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids: ids })
                    }).then(response => response.json()).then(data => {
                        if (data.status == "success") {
                            Swal.fire({
                                title: "Success",
                                text: "Task(s) has been marked as done",
                                icon: 'success'
                            });

                            loadTasks();
                        } else {
                            Swal.fire({
                                title: "Failed",
                                text: "Task(s) failed to mark as done",
                                icon: 'error'
                            });
                        }
                    });
                }
            });

        }

        function deleteChecked() {
            const checkboxDelete = document.querySelectorAll('.task-checkbox:checked');
            if (checkboxDelete.length === 0) {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Please select at least one task.',
                    icon: 'warning'
                });
                return;
            } 

            const deleteIds = Array.from(checkboxDelete).map(cb => cb.value);

                Swal.fire({
                    title: "Are you sure?",
                    text: `You are about to mark ${deleteIds.length} task(s) as done.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Delete it!"
                }).then(res => {
                    if(res.isConfirmed)
                    {
                        fetch('/todo/delete-bulk', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ ids: deleteIds})
                        }).then(res => res.json()).then(data => {
                            if(data.status == "success")
                            {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Task(s) deleted successfully!",
                                    icon: "success"
                                });

                                loadTasks();
                            }else{
                                Swal.fire({
                                    title: "Failed!",
                                    text: "Task(s) failed to delete!",
                                    icon: "error"
                                });
                            }
                        });
                    }
                });


        }
        
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('updateBtn').addEventListener('click', () => {
                const updateId = document.getElementById('update-task-id').value;
                const updateTask = document.getElementById('update-input-task').value;

                fetch(`/todo/update/${updateId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task: updateTask })

                }).then(response => response.json()).then(data => {
                    if (data.status === "success") {
                        loadTasks();

                        let updateModal = document.getElementById('updateModal');
                        let modal = bootstrap.Modal.getInstance(updateModal);
                        modal.hide();

                        Swal.fire({
                            title: "Updated!",
                            text: "Your task has been updated.",
                            icon: "success"
                        });
                    } else {
                        alert(data.message);
                    }
                });
            });

            loadTasks();
        });

        function openUpdateModal(id) {
            fetch(`/todo/update-fetch/${id}`).then(res => res.json()).then(data => {
                if (data.status == "success") {
                    console.log(data);
                    document.getElementById('update-task-id').value = data.task.id;
                    document.getElementById('update-input-task').value = data.task.task;
                } else {
                    alert(data.message);
                }
            });
            let modal = document.getElementById('updateModal');
            const updateModal = new bootstrap.Modal(modal);
            updateModal.show();
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


        function addTask() {
            let taskValue = document.getElementById('taskInput').value.trim();

            fetch('/todo/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: taskValue
                })

            }).then(response => response.json()).then(data => {
                console.log(data);
                if (data.status === 'success') {
                    document.getElementById('taskInput').value = '';
                    loadTasks();
                } else {
                    alert(data.message);
                }
            })
        }

        
        function deleteTask(id) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/todo/delete/${id}`).then(res => res.json()).then(data => {
                        if (data.status === 'success') {
                            const row = document.getElementById('row-' + data.id);
                            if (row) {
                                row.remove();
                            }
                            loadTasks();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        } else {
                            Swal.fire({
                                title: "Failed to Delete!",
                                text: "Task Failed to delete.",
                                icon: "error"
                            });
                        }
                    }).catch(err => {
                        console.error(err);
                        alert('Delete failed. Check console for error.');
                    });
                }
            });
        }

        // document.addEventListener('DOMContentLoaded', () => {
        //     loadTasks();
        // });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>