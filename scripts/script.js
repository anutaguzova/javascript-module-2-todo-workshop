
const button = document.querySelector(".button");
button.style.backgroundColor = "green";


let todos = [];

function createToDo(text) {
    todos.push({
        title: text,
        completed: false
    })
    saveTodosToLocalStorage();
}

const filters = {
    searchTitle: '',
    showFinished: false,
    showUnfinished: false
}

const setFilters = (updates) => {
    if (typeof updates.searchTitle === 'string') {
        filters.searchTitle = updates.searchTitle
    }
    if (typeof updates.showFinished === 'boolean') {
        filters.showFinished = updates.showFinished
    }
    if (typeof updates.showUnfinished === 'boolean') {
        filters.showUnfinished = updates.showUnfinished
    }
}

// Render application todos based on filters
const renderTodos = (todos) => {
    // filtered Todos
    let filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(filters.searchTitle.toLowerCase()))
    if(filters.showFinished && filters.showUnfinished) {
      // do nothing
    } else if(filters.showFinished) {
      filteredTodos = filteredTodos.filter((todo) => todo.completed)
    } else if(filters.showUnfinished) {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed)
    }
    
    const todoList = document.querySelector('#todos')
    todoList.innerHTML = ''

    if (filteredTodos.length > 0) {
        filteredTodos.forEach((todo) => {
            todoList.appendChild(generateTodoDOM(todo))
        })
    } else {
        const messageEl = document.createElement('p')
        messageEl.classList.add('empty-message')
        messageEl.textContent = 'There are no todos to show'
        todoList.appendChild(messageEl)
    }
}


document.querySelector('#search-text').addEventListener('input', (e) => {
    setFilters({
        searchTitle: e.target.value
    })
    renderTodos(todos)
})

document.querySelector('#show-finished').addEventListener('change', (e) => {
    setFilters({
        showFinished: e.target.checked
    })
    renderTodos(todos)
})

document.querySelector('#show-unfinished').addEventListener('change', (e) => {
    setFilters({
        showUnfinished: e.target.checked
    })
    renderTodos(todos)
})


document.querySelector('#new-todo').addEventListener('submit', (e) => {
    e.preventDefault();

    const text = e.target.elements.text.value;

    if (text.length > 0) {
        createToDo(text);
        e.target.elements.text.value = ""
    }

    renderTodos(todos);
})



const removeTodo = (title) => {
    const todoIndex = todos.findIndex((todo) => {
        return todo.title.toLowerCase() === title.toLowerCase()
    })
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
        saveTodosToLocalStorage();
    }
}

const toggleTodo = (title) => {
    const todo = todos.find((element) => element.title === title);
     if(todo) {
       todo.completed = !todo.completed;
       saveTodosToLocalStorage();
     }
 }
 

const generateTodoDOM = (todoObj) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const todoText = document.createElement('span')

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = todoObj.completed;
    containerEl.appendChild(input);

    input.addEventListener("change", () => {
        toggleTodo(todoObj.title)
        renderTodos(todos)
    })
    
    // Setup the todo text
    todoText.textContent = todoObj.title
    containerEl.appendChild(todoText)

    // Setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    // Setup the remove button
    const removeButton = document.createElement('button')
    removeButton.textContent = 'remove'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeTodo(todoObj.title)
        renderTodos(todos)
    })

    return todoEl
}


function saveTodosToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const fetchTodosFromLocalStorage = () => {
    const todosJSON = localStorage.getItem('todos')

    if (todosJSON) {
        todos = JSON.parse(todosJSON)
    } else {
        todos = []
    }
}


window.addEventListener('storage', (e) => {
    if (e.key === 'todos') {
        fetchTodosFromLocalStorage()
        renderTodos(todos)
    }
})

fetchTodosFromLocalStorage()
renderTodos(todos)
