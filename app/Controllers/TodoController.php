<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\TodoModel;
use CodeIgniter\HTTP\ResponseInterface;

class TodoController extends BaseController
{
    public function index()
    {
        return view('todo_view');
    }

    public function fetchAll()
    {
        $model = new TodoModel();
        $search = $this->request->getGet('search');

        if($search)
        {
            $model->like('task', $search);
        }
        $data = $model->findAll();

        return $this->response->setJSON($data);
    }

    public function storeBulkTask()
    {
        $model = new TodoModel();

        $data = $this->request->getJSON(true);
        $tasks = $data['tasks'];

        if (count($tasks) < 0) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'No task added'
            ]);
        }
        foreach ($tasks as $task) {
            $model->insert(['task' => $task]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Task(s) added successfully'
        ]);
    }
    public function fetchById($id)
    {
        $model = new TodoModel();
        $data = $model->where('id', $id)->first();

        return $this->response->setJSON([
            'task' => $data,
            'status' => 'success',
            'message' => 'Fetch Successfully'
        ]);
    }

    public function store()
    {
        $model = new TodoModel();

        $data = $this->request->getJSON(true);

        $task = $data['task'] ?? null;

        if (!$task) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Task is Required'
            ]);
        }

        $id = $model->insert([
            'task' => $task
        ]);

        return $this->response->setJSON([
            'status' => 'success',
            'id' => $id,
            'task' => $task
        ]);
    }

    public function delete($id)
    {
        $model = new TodoModel();

        $delete = $model->delete($id);

        if (!$delete) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to Delete'
            ]);
        }
        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Deleted Successfully'
        ]);
    }

    public function markDone($id)
    {
        $model = new TodoModel();
        $mark = $model->update($id, ['is_done' => 1]);
        if (!$mark) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to mark done.'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Task marked done successfully'
        ]);
    }

    public function markDoneBulk()
    {
        $model = new TodoModel();
        $data = $this->request->getJSON(true);

        if (count($data['ids']) < 0) {
            return $this->response->setJSON([
                "status" => "error",
                "message" => "No task selected"
            ]);
        }

        $model->whereIn('id', $data['ids'])->set(['is_done' => 1])->update();

        return $this->response->setJSON([
            "status" => "success"
        ]);
    }

    public function deleteBulk()
    {
        $model = new TodoModel();
        $data = $this->request->getJSON(true);

        if (count($data['ids']) < 0) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'No task(s) selected'
            ]);
        }

        $model->whereIn('id', $data['ids'])->delete();

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Task(s) deleted successfully'
        ]);
    }
    public function update($id)
    {
        $model = new TodoModel();
        $find = $model->where('id', $id)->first();

        if (!$find) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Task not Found.'
            ]);
        }

        $data = $this->request->getJSON(true);

        $task = $data['task'] ?? null;

        $model->update($id, ['task' => $task]);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Update Successfully'
        ]);
    }
}
