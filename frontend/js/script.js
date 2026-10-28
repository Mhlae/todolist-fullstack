const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');
const feedback = document.querySelector('.feedback');
const apiUrl = 'http://localhost:3333/tasks';

const showError = (error) => {
    feedback.textContent = error.message;
    console.error(error);
};

const request = async (url, options) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`A solicitação falhou (HTTP ${response.status}).`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

const fetchTasks = () => request(apiUrl);

const addTask = async (event) => {
    event.preventDefault();
    const title = inputTask.value.trim();

    if (!title) {
        feedback.textContent = 'Digite o título da tarefa.';
        inputTask.focus();
        return;
    }

    try {
        await request(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });

        inputTask.value = '';
        feedback.textContent = '';
        await loadTasks();
    } catch (error) {
        showError(error);
    }
};

const deleteTask = async (id) => {
    try {
        await request(`${apiUrl}/${id}`, { method: 'DELETE' });
        feedback.textContent = '';
        await loadTasks();
    } catch (error) {
        showError(error);
    }
};

const updateTask = async (id, title, status) => {
    await request(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
    });
};

const formatDate = (dateValue) => {
    const normalizedDate = typeof dateValue === 'string'
        && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)
        ? `${dateValue.replace(' ', 'T')}Z`
        : dateValue;
    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleString('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo',
    });
};

const createElement = (tag, text = '') => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
};

const createSelect = (value) => {
    const select = createElement('select');
    const statuses = [
        ['pendente', 'Pendente'],
        ['em andamento', 'Em andamento'],
        ['concluida', 'Concluída'],
    ];

    statuses.forEach(([status, label]) => {
        const option = createElement('option', label);
        option.value = status;
        select.appendChild(option);
    });

    select.value = value;
    return select;
};

const createActionButton = (icon, label) => {
    const button = createElement('button');
    const iconElement = createElement('span', icon);

    button.type = 'button';
    button.classList.add('btn-action');
    button.setAttribute('aria-label', label);
    iconElement.classList.add('material-symbols-outlined');
    button.appendChild(iconElement);

    return button;
};

const createRow = (task) => {
    const { id, title, created_at: createdAt, status } = task;
    const tr = createElement('tr');
    const tdTitle = createElement('td', title);
    const tdCreatedAt = createElement('td', formatDate(createdAt));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');
    const select = createSelect(status);
    const editButton = createActionButton('edit', 'Editar tarefa');
    const deleteButton = createActionButton('delete', 'Excluir tarefa');

    select.addEventListener('change', async () => {
        try {
            await updateTask(id, title, select.value);
            feedback.textContent = '';
            await loadTasks();
        } catch (error) {
            showError(error);
            select.value = status;
        }
    });

    editButton.addEventListener('click', () => {
        const editForm = createElement('form');
        const editInput = createElement('input');

        editInput.type = 'text';
        editInput.value = title;
        editInput.required = true;
        editInput.setAttribute('aria-label', 'Editar título da tarefa');
        editForm.appendChild(editInput);
        tdTitle.replaceChildren(editForm);
        editInput.focus();

        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                tdTitle.textContent = title;
            }
        });

        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const updatedTitle = editInput.value.trim();

            if (!updatedTitle) {
                feedback.textContent = 'O título da tarefa não pode ficar vazio.';
                editInput.focus();
                return;
            }

            try {
                await updateTask(id, updatedTitle, select.value);
                feedback.textContent = '';
                await loadTasks();
            } catch (error) {
                showError(error);
            }
        });
    });

    deleteButton.addEventListener('click', () => deleteTask(id));
    tdStatus.appendChild(select);
    tdActions.append(editButton, deleteButton);
    tr.append(tdTitle, tdCreatedAt, tdStatus, tdActions);

    return tr;
};

const loadTasks = async () => {
    const tasks = await fetchTasks();
    tbody.replaceChildren(...tasks.map(createRow));
};

addForm.addEventListener('submit', addTask);
loadTasks().catch(showError);
