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
                <h3 class="card-title">Add Task</h3>

                <div class="" id="taskInput">
                    <div class="input-group mb-2">
                        <input type="text" class="form-control task-input" placeholder="Enter your task">
                        <button class="btn btn-close removeTask-btn"></button>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-secondary" id="addTaskBtn">+ Add another task</button>
                    <button class="btn btn-primary" id="submitTasks">Save Task(s)</button>
                </div>
            </div>
        </div>

        <!-- <div class="container mt-2 mb-3">
            <input type="text" id="taskInput" class="form-control mb-2" placeholder="Enter Task">
            <button class="btn btn-primary" onclick="addTask()">Add Task</button>
        </div> -->

        <div class="card mt-3 p-2 mb-2">
            <div class="card-body">
                <h5 class="card-title">Todo Lists</h5>
                <div class="d-flex gap-2">
                    <input type="text" class="form-control border border-1 border-primary"
                        placeholder="Search your task here..." id="searchInput">

                    <select name="" id="statusFilter" class="form-control">
                        <option value="">All</option>
                        <option value="1">Done</option>
                        <option value="0">Not Done</option>
                    </select>
                </div>
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
                <tbody id="taskTable" class="text-center"></tbody>
            </table>
        </div>


        <div class="mb-2 text-end check-options d-none">
            <div class="d-inline-flex gap-2">
                <button id="markDoneBtn" class="btn btn-success">Mark as Done</button>
                <button id="deleteCheckBtn" class="btn btn-danger">Delete</button>
            </div>
        </div>

    </div>
    <nav class="mt-3">
        <ul class="pagination justify-content-center" id="pagination"></ul>
    </nav>


    <!-- update modal -->
    <div class="modal fade" id="updateModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="modalUpdateTitle"></h4>
                    <button data-bs-dismiss="modal" class="btn-close" type="button"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="update-task-id">
                    <label for="" class="form-label">Task Title</label>
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
    <!-- <script src="< base_url('js/todo.js') ?>"></script> -->
    <script type="module">
        import '<?= base_url('js/main.js') ?>';
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>