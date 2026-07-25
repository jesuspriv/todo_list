import Todo from "./Todo.js";
 
class Project{
    constructor(name){
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }
    addTodo(title, description, dueDate, priority, checkList, completed){
        const newTodo = new Todo(title, description, dueDate, priority, checkList, completed);
        this.todos.push(newTodo)
    }
    removeTodo(id){
        this.todos = this.todos.filter(todo => todo.id !== id);
    }
    getTodo(){
        return this.todos;
    }
}
export default Project;