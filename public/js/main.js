import * as API from './api.js';
import * as UI from './ui.js';
import { attachEvents } from './events.js';

window.currentPage = 1;

export async function loadTasks()
{
    const search = document.getElementById('searchInput').value;
    const filter = document.getElementById('statusFilter').value;

    try {
        const response = await API.fetchTasksApi(search, filter, window.currentPage);
        if(response.data.status == "error") Swal.fire('Error', response.data.message, 'error');

        UI.renderTasks(response.data);
    } catch (error) {
        UI.showAlert('Error', error.message, 'error');
    }
}

export async function deleteTask(ids)
{
    try {
        const res = await API.deleteCheckedApi(ids);
        if(res.status != 'success')
        {
            Swal.fire('Error', res.message, 'error');
        }

        Swal.fire('Success', res.message, 'success');
    } catch (error) {
        console.error(error.message);
        Swal.fire('Error', error.message, 'error');
    }
}


export async function openUpdateModal(id)
{
    try {
        const res = API.fetchByIdApi(id);
        if(res.status == 'error') Swal.fire('Error', res.message, 'error');

        document.getElementById("update-task-id").value = res.task.id;
        document.getElementById("update-input-task").value = res.task.task;

        let modal = document.getElementById("updateModal");
        const updateModal = new bootstrap.Modal(modal);
        updateModal.show();

    } catch (error) {
        console.error(error.message);
        Swal.fire('Error', error.message, 'error');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    attachEvents();
    loadTasks();
})