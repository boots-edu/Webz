import {
    BindCSSClass,
    Click,
    EventSubject,
    WebzComponent,
    WebzDialog,
    Timer,
    TimerCancelFunction,
} from "@boots-edu/webz";
import html from "./tasks.component.html";
import css from "./tasks.component.css";
import { TasklineComponent } from "../taskline/taskline.component";
import { TaskData } from "../taskeditor/taskeditor.component";
import guid from "guid";

/**
 * @description Top level component of the task list.
 * @class TasksComponent
 * @extends {WebzComponent}
 * @property {EventSubject<TaskData[]>} saveData - event subject for the save event.  emits the task data when the save event is triggered.
 * @memberof TasksComponent
 */
export class TasksComponent extends WebzComponent {
    /**
     * @description CSS class for the add button when it is disabled.
     * @memberof TasksComponent
     * @type {string}
     * @default ""
     * @summary Binds the value to the className of add-task id in the html file.
     */
    @BindCSSClass("add-task") addDisabled: string;

    private taskLines: TasklineComponent[] = [];
    private counter: number = 0;

    /**
     * @description Event subject for the save event.  emits the task data when the save event is triggered.
     * @memberof TasksComponent
     * @type {EventSubject<TaskData[]>}
     * @example
     * this.saveData.subscribe((data) => {
     *    console.log(data);
     * });
     */
    saveData: EventSubject<TaskData[]> = new EventSubject<TaskData[]>();

    /**
     * @description Extracts the task data for the component from the task lines.
     * @memberof TasksComponent
     * @type {TaskData[]}
     */
    private get taskData(): TaskData[] {
        return this.taskLines.map((task) => task.data);
    }

    /**
     * @description Sets the task data for the component by creating new task lines for the data.
     * @memberof TasksComponent
     * @type {TaskData[]}
     * @example
     * this.taskData = [{taskText: "Task 1"}, {taskText: "Task 2"}];
     */
    private set taskData(data: TaskData[]) {
        this.taskLines.forEach((line) => {
            this.removeComponent(line);
        });
        this.taskLines = [];
        data.forEach((task) => {
            let line = new TasklineComponent(task);
            this.addComponent(line, "task-list");
            this.taskLines.push(line);
            this.wireUpTaskLine(line);
            line.disableEditing();
        });
        this.taskLines.forEach((task) => {
            task.disableViewButtons(false);
        });
        this.addDisabled = "";
    }

    /**
     * @description Creates an instance of TasksComponent.
     * @param {TaskData[]} [data=[]] - the task data to initialize the component with.
     * @memberof TasksComponent
     * @constructor
     */
    constructor(data: TaskData[] = []) {
        super(html, css);
        this.addDisabled = "";
        this.taskData = data;
    }

    /**
     * @description Event handler for the add task button.  Adds a new task line to the list.
     * @memberof TasksComponent
     * @method onAddTask
     * @summary Binds the method to the add-task id in the html file.
     * @private
     */
    @Click("add-task") private onAddTask() {
        let taskLine = new TasklineComponent();
        this.addComponent(taskLine, "task-list", true);
        this.taskLines.unshift(taskLine);
        this.wireUpTaskLine(taskLine);
        taskLine.startEditing();
    }

    /**
     * @description Event handler for the clear tasks button.  Clears all tasks from the list.
     * @memberof TasksComponent
     * @method onClearTasks
     * @summary Binds the method to the clear-tasks id in the html file.
     * @private
     */
    @Click("clear-tasks") private onClearTasks() {
        if (this.taskLines.length === 0) {
            WebzDialog.popup(
                this,
                "There are no tasks to clear.",
                "Notice",
                ["Ok"],
                "btn btn-primary",
            );
        } else {
            WebzDialog.popup(
                this,
                "Are you sure you want to clear all tasks?",
                "Warning",
                ["Yes", "No", "Cancel"],
                "btn btn-primary",
            ).subscribe((result) => {
                if (result === "Yes") {
                    this.taskLines.forEach((task) => {
                        this.removeComponent(task);
                    });
                    this.taskLines = [];
                    this.saveData.next(this.taskData);
                }
            });
        }
    }

    /**
     * @description Connects the taskLine EventSubjects to the TasksComponent.
     * @memberof TasksComponent
     * @method onDeleteAllTasks
     * @param {TasklineComponent} line - the task line to connect the events to.
     * @returns {void}
     * @summary Binds the lineEdit, lineEditClose, and lineDelete events to the line.
     * On Line edit, the add button is disabled and all child edit/cancel buttons are disabled.
     * On Line delete, the line is removed from the list and the component is removed.
     * On Line edit close, the add button is enabled and all child edit/cancel buttons are enabled.
     * @private
     */
    private wireUpTaskLine(line: TasklineComponent) {
        //if we start editing, then we want to disable the add button and all child edit/cancel buttons
        line.lineEdit.subscribe(() => {
            this.addDisabled = "disabled";
            this.taskLines.forEach((task) => {
                task.disableViewButtons();
            });
        });

        //if we are deleting, then we want to remove the line from the list and remove the component
        line.lineDelete.subscribe(() => {
            this.removeComponent(line);
            this.taskLines.splice(this.taskLines.indexOf(line), 1);
            this.saveData.next(this.taskData);
        });

        //if we are closing editor, then we want to enable the add button and all child edit/cancel buttons
        line.lineEditClose.subscribe((save) => {
            this.addDisabled = "";
            this.taskLines.forEach((task) => {
                task.disableViewButtons(false);
            });
            if (save) {
                if (line.data.uniqueID === undefined) {
                    line.data.uniqueID = guid.create();
                }
                //save the data to a datasource
                this.saveData.next(this.taskData);
            } else if (line.data.uniqueID === undefined) {
                this.removeComponent(line);
                this.taskLines.splice(this.taskLines.indexOf(line), 1);
            }
        });
    }

    /**
     * @description Event handler for the counter function.  Increments the counter and cancels the function when the counter reaches 15.
     * @memberof TasksComponent
     * @method counterfn
     * @param {CancelFunction} cancel - the function to call to cancel the timer.
     * @summary Calls the cancel function once per second until the counter reaches 15, then uses the supplied cancel function to kill the timer.
     * @private
     */
    @Timer(1000)
    private counterfn(cancel: TimerCancelFunction) {
        this.counter++;
        console.log(this.counter);
        if (this.counter >= 15) {
            cancel();
        }
    }
}
