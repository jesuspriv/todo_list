
import Project from "./Project.js";
import { saveProjects } from "./Storage.js";

const btnProject = document.querySelector(".newProject");
const btnTodo = document.querySelector(".newTodo");
const dialogTodo = document.querySelector(".todo_dialog");
const dialogProject = document.querySelector(".project_dialog");
const closeModals = document.querySelectorAll(".cancel-button");
const dialogForm = document.querySelector(".todo-form");
const formProject = document.querySelector(".project-form");
const formEdit = document.querySelector(".edit-form");

let projects = [];
let activeProject = null;
let activeTodo = null;

export function initUI(loadedProjects){
    projects = loadedProjects;
    renderProjects(projects);
    if(projects.length > 0){
        activeProject = projects[0];
        renderTodos(activeProject);
        updateDashboard(activeProject);
    }
}


btnProject.addEventListener('click', ()=>{
    dialogProject.showModal();
});
btnTodo.addEventListener('click', ()=>{
    dialogTodo.showModal();
})
closeModals.forEach((boton) => {
    boton.addEventListener('click', (e) => {
        dialogTodo.close();
        dialogProject.close();
    })
})
dialogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const date = document.querySelector("#date").value;
    const select = document.querySelector("#priority").value;

    activeProject.addTodo(title, description, date, select);
    saveProjects(projects);
    renderProjects(projects);
    renderTodos(activeProject);
    updateDashboard(activeProject)
    dialogForm.reset();
});

formProject.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameProject = document.querySelector("#name").value;
    const descriptionProject = document.querySelector("#description-project").value;
    const color = document.querySelector("#color").value;

    const newProject = new Project(nameProject);
    projects.push(newProject);
    saveProjects(projects);
    renderProjects(projects);
    updateDashboard(activeProject)
    dialogProject.close();
    
});

formEdit.addEventListener('submit', (e)=>{
    e.preventDefault();

    const editTitle = document.querySelector("#edit-title").value;
    const editDescription = document.querySelector("#edit-description").value;
    const editDate = document.querySelector("#edit-date").value;
    const editPriority = document.querySelector("#edit-priority").value;
    
    activeTodo.title = editTitle;
    activeTodo.description = editDescription;
    activeTodo.dueDate = editDate;
    activeTodo.priority = editPriority;

    saveProjects(projects);
    renderProjects(projects);
    renderTodos(activeProject);
    document.querySelector(".editar-todo-dialog").close()
});

export function renderProjects(projects){
    const sider = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    const ul = document.createElement("ul");

    const existingUl = sider.querySelector('ul');
    if(existingUl) existingUl.remove();

    projects.forEach(project => {
        const li = document.createElement("li");
        const btnDeleteList = document.createElement("button");

        btnDeleteList.classList.add("btn-delete-list");
        btnDeleteList.textContent = "Eliminar project";
        
        li.textContent = project.name;
        li.appendChild(btnDeleteList);
        ul.appendChild(li);

        li.addEventListener('click', () => {
            activeProject = project;
            document.querySelector(".project-title").textContent = project.name;
            renderTodos(project);
           
        })
        btnDeleteList.addEventListener('click', (e) => {
            e.stopPropagation();

            const updatedProjects = projects.filter(p => p.id !== project.id);
            projects = updatedProjects;
            saveProjects(updatedProjects);
            renderProjects(updatedProjects);
            if (main) main.innerHTML = "";
        })

    });
    sider.appendChild(ul)
}

function renderTodos(projects){
    const main = document.querySelector("main");
    const editTodo = document.querySelector(".editar-todo-dialog");
    const vistaDialog = document.querySelector(".detail-todo-dialog");
    const cerrarVistaDialog = document.querySelector(".detail-close");

    main.innerHTML = "";
    projects.todos.forEach(todo => {
        const cards = document.createElement("div");
        cards.classList.add('todo-card');
        const h2 = document.createElement("h2");
        const p = document.createElement("p");

        h2.textContent = todo.title;
        p.textContent = todo.dueDate;
        cards.appendChild(h2);
        cards.appendChild(p);
        main.appendChild(cards);
        cards.dataset.priority = todo.priority;
        const deleteBtn = document.createElement("button");
        const editarTodoBtn = document.createElement("button");
        const completedBtn = document.createElement("button");
        completedBtn.classList.add("btn-complete");
        editarTodoBtn.classList.add("btn-editar-list");
        deleteBtn.classList.add("btn-delete");
        deleteBtn.textContent = "Eliminar tarea";
        editarTodoBtn.textContent = "Editar tarea";
        completedBtn.textContent = "Completar";
        deleteBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            activeProject.removeTodo(todo.id);
            saveProjects(projects);
            renderTodos(activeProject);
            updateDashboard(activeProject)
            updateDashboard(activeProject)
        })
        editarTodoBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            activeTodo = todo;
            editTodo.showModal();
            const editTitle = document.querySelector("#edit-title").value = todo.title;
            const editDescription = document.querySelector("#edit-description").value = todo.description;
            const editDate = document.querySelector("#edit-date").value = todo.dueDate;
            const editPriority = document.querySelector("#edit-priority").value = todo.priority;
        });
        completedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todo.toggleCompleted();
            saveProjects(projects);
            renderTodos(activeProject);
            updateDashboard(activeProject)
        })
        cards.appendChild(deleteBtn);
        cards.appendChild(editarTodoBtn);
        cards.appendChild(completedBtn);

          if(todo.completed){
            cards.classList.add('todo-completado');
            completedBtn.textContent = "✓ Completado";
        } else {
            completedBtn.textContent = "Completar";
        }
        cards.addEventListener('click', ()=>{
            vistaDialog.showModal();
            document.querySelector(".detail-title").textContent = todo.title;
            document.querySelector(".detail-date").textContent = todo.dueDate;
            document.querySelector(".detail-priority").textContent = todo.priority;
            document.querySelector(".detail-status").textContent = todo.completed ? "✅ Completado" : "⏳ Pendiente";
            document.querySelector(".detail-description").textContent = todo.description;
        });
        cerrarVistaDialog.addEventListener('click', () =>{
            vistaDialog.close();
        } )
    });
 
}

    function updateDashboard(project) {
    const total = project.todos.length;
    const completed = project.todos.filter(todo => todo.completed === true).length;
    const pending = total - completed;
    const porcentaje = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.querySelector("#total-tasks").textContent = total;
    document.querySelector("#completed-tasks").textContent = completed;
    document.querySelector("#pending-tasks").textContent = pending;
    document.querySelector("#progress-fill").style.width = porcentaje + "%";
    document.querySelector("#progress-label").textContent = porcentaje + "% completado"
}


