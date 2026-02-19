import { loadTasks, deleteTask } from "./main.js";

export function attachEvents()
{
    const tbody = document.getElementById('taskTable');


    let debounce;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            loadTasks();
        }, 300);
        window.currentPage = 1;
    });

    document.getElementById('statusFilter').addEventListener('change', () => {
        window.currentPage = 1;
        loadTasks();
    });
}