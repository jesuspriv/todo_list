    class Todo{
        constructor(title, description, dueDate, priority, checkList, completed){
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
            this.checkList = checkList;
            this.completed = completed;
            this.id = crypto.randomUUID();
        }

        toggleCompleted(){
            this.completed = !this.completed;
        }
        updatePriority(newPriority){
            this.priority = newPriority
        }

    }
    export default Todo;