import html from "./main.component.html";
import css from "./main.component.css";
import { WebzComponent } from "@boots-edu/webz";
import { TasksComponent } from "./components/tasks/tasks.component";
import { TaskData } from "./components/taskeditor/taskeditor.component";

declare const window: Window;
/**
 * @description Top level component of the application.
 * @class MainComponent
 * @extends {WebzComponent}
 * @memberof MainComponent
 */
export class MainComponent extends WebzComponent {
    private taskComponent: TasksComponent;

    /**
     * @description Creates an instance of MainComponent.
     * @memberof MainComponent
     */
    constructor() {
        super(html, css);
        //using cookies for persistence.  In a real application we would use a database or some other form of storage like an API
        let savedData = window.localStorage.getItem("taskData");
        if (savedData) {
            let data: TaskData[] = JSON.parse(savedData) as TaskData[];
            this.taskComponent = new TasksComponent(data);
        } else {
            this.taskComponent = new TasksComponent();
        }
        this.addComponent(this.taskComponent, "task-target");

        this.taskComponent.saveData.subscribe((data) => {
            window.localStorage.setItem("taskData", JSON.stringify(data));
        });
    }
}
