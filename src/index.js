import { loadProjects, saveProjects } from "./Storage.js";
import Project from "./Project.js";
import { initUI } from "./UI.js";
import "./styles.css";

let projects = loadProjects();

if(projects.length === 0){
    const defaultProject = new Project("General");
    projects.push(defaultProject);
    saveProjects(projects)
    
}
initUI(projects);