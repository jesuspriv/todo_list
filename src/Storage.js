import Project from "./Project.js";
import Todo from "./Todo.js";

export function saveProjects(projects){
    localStorage.setItem("misProjectos", JSON.stringify(projects));
};

export function loadProjects(){
    const projectsLoad = localStorage.getItem("misProjectos");

    if(!projectsLoad){
        return [];
    }
    const data =  JSON.parse(projectsLoad);
    console.log(data)
        if(!Array.isArray(data)){
            return [];
        }
    return data.map(projectData => {
        const project = new Project(projectData.name);
        project.id = projectData.id
        project.todos = projectData.todos.map(todosData => {
            const todo = new Todo(todosData.title, todosData.description, todosData.dueDate, todosData.priority, todosData.checkList, todosData.completed);
            todo.id = todosData.id;
            return todo;
        })
        return project
    })
    
}
