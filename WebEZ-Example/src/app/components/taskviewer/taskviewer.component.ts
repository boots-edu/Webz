import {
    BindCSSClass,
    BindInnerHTML,
    Click,
    EventSubject,
    EzComponent,
} from "@gsilber/webez";
import html from "./taskviewer.component.html";
import css from "./taskviewer.component.css";
import { TaskData } from "../taskeditor/taskeditor.component";
import { AlertComponent } from "../alert/alert.component";

/**
 * @description Component for viewing a task.
 * @class TaskViewerComponent
 * @extends {EzComponent}
 * @property {EventSubject<void>} editing - event subject for the edit event.
 * @property {EventSubject<void>} deleting - event subject for the delete event.
 * @property {TaskData} data - the task data for the viewer.
 * @method {setData} - sets the task data for the viewer.
 * @method {disableButtons} - disables the buttons.
 * @memberof TaskViewerComponent
 */
export class TaskviewerComponent extends EzComponent {
    //event sources
    editing: EventSubject<void> = new EventSubject<void>();
    deleting: EventSubject<void> = new EventSubject<void>();

    @BindInnerHTML("taskview") private taskview: string = "";
    @BindCSSClass("edit") private editDisabled: string = "";
    @BindCSSClass("delete") private deleteDisabled: string = "";

    /**
     * @description Creates an instance of TaskViewerComponent.
     * @param {TaskData} [data={ taskText: "" }] - the task data to view.  If no task data is provided, the task text will be empty.
     * @memberof TaskViewerComponent
     */
    constructor(private data: TaskData = { taskText: "" }) {
        super(html, css);
        this.taskview = data.taskText;
    }

    /**
     * @description event handler for the edit button.  emits the editing event.
     * @memberof TaskViewerComponent
     */
    @Click("edit") private onEdit() {
        this.editing.next();
    }

    /**
     * @description event handler for the delete button.  emits the deleting event.
     * @memberof TaskViewerComponent
     */
    @Click("delete") private onDelete() {
        const alert: AlertComponent = new AlertComponent();
        this.addComponent(alert);
        alert
            .confirmMessage(
                "Are you sure you want to delete this task?",
                "Confirm Delete",
            )
            .then((result) => {
                if (result) this.deleting.next();
            });
    }

    /**
     * @description sets the task data for the viewer.
     * @param {TaskData} data - the task data to view.
     * @memberof TaskViewerComponent
     */
    setData(data: TaskData): void {
        this.data = data;
        this.taskview = data.taskText;
    }

    /**
     * @description disables the buttons.
     * @param {boolean} [disable=true] - true to disable the buttons, false to enable them.
     * @memberof TaskViewerComponent
     */
    disableButtons(disable: boolean = true) {
        this.editDisabled = disable ? "disabled" : "";
        this.deleteDisabled = disable ? "disabled" : "";
    }
}
