// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
function addToDo(event) {
    event.preventDefault();
    
    // Check if input is empty
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }
    
    // Create the todo div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    
    // Create the todo item
    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);
    
    // Create priority selector
    const prioritySelect = document.createElement('select');
    prioritySelect.classList.add('priority-select');
    ['Low', 'Medium', 'High'].forEach(priority => {
        const option = document.createElement('option');
        option.value = priority.toLowerCase();
        option.innerText = priority;
        prioritySelect.appendChild(option);
    });
    toDoDiv.appendChild(prioritySelect);

    // Check button
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);
    
    // Delete button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);
    
    // Append to list
    toDoList.appendChild(toDoDiv);
    
    // Save to localStorage
    savelocal(toDoInput.value, prioritySelect.value);
    
    // Clear input field
    toDoInput.value = '';
}

// Delete or check task
function deletecheck(event) {
    const item = event.target;
    
    // Delete task
    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }
    
    // Check task
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
}

// Save to localStorage
function savelocal(todo, priority) {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
    todos.push({ task: todo, priority: priority });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Retrieve todos from localStorage
function getTodos() {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
    
    todos.forEach(function (todoObj) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add('todo', `${savedTheme}-todo`);
        
        // Create the todo item
        const newToDo = document.createElement('li');
        newToDo.innerText = todoObj.task;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);
        
        // Priority selection dropdown
        const prioritySelect = document.createElement('select');
        prioritySelect.classList.add('priority-select');
        ['Low', 'Medium', 'High'].forEach(priority => {
            const option = document.createElement('option');
            option.value = priority.toLowerCase();
            option.innerText = priority;
            if (todoObj.priority === option.value) {
                option.selected = true;
            }
            prioritySelect.appendChild(option);
        });
        toDoDiv.appendChild(prioritySelect);
        
        // Check button
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        
        // Delete button
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);
        
        // Append to list
        toDoList.appendChild(toDoDiv);
    });
}

// Remove from localStorage
function removeLocalTodos(todo) {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
    const todoIndex = todos.findIndex(item => item.task === todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change Theme
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    color === 'darker' ?
        document.getElementById('title').classList.add('darker-title') :
        document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed` :
            todo.className = `todo ${color}-todo`;
    });

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        }
    });
}
