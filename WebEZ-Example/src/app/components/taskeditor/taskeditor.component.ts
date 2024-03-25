import {
    BindCSSClass,
    Click,
    EzComponent,
    EventSubject,
    BindValue,
    Input,
} from "@gsilber/webez";
import html from "./taskeditor.component.html";
import css from "./taskeditor.component.css";

/** interface for records in the task list.
 * @description interface for records in the task list.
 * @interface TaskData
 * @property {object} uniqueID - unique identifier for the task.  undefined until a record is saved for the first time.
 * @property {string} taskText - the text of the task.
 */
export interface TaskData {
    uniqueID?: object;
    taskText: string;
}

/**
 * @description Component for editing a task.
 * @class TaskEditorComponent
 * @extends {EzComponent}
 * @property {EventSubject<boolean>} editClose - event subject for the close event.  true if the save button was clicked, false if the cancel button was clicked.
 * @memberof TaskEditorComponent
 */
export class TaskeditorComponent extends EzComponent {
    @BindValue("tasktext") private tasktext: string = "";
    @BindCSSClass("save") private saveDisabled: string = "disabled";
    @Input("tasktext") private onTaskTextChange() {
        this.saveDisabled = this.tasktext === "" ? "disabled" : "";
    }

    editClose: EventSubject<boolean> = new EventSubject<boolean>();

    /**
     * @description Creates an instance of TaskEditorComponent.
     * @param tasks - the task data to edit.  If no task data is provided, the task text will be empty and uniqueID will be undefined.
     * @memberof TaskEditorComponent
     */
    constructor(private tasks: TaskData = { taskText: "" }) {
        super(html, css);
        this.tasktext = tasks.taskText;
    }

    /**
     * @description event handler for the save button.  sets the task text and emits the editClose event with true.
     */
    @Click("save") private onSave() {
        this.tasks.taskText = this.tasktext;
        this.editClose.next(true);
    }

    /**
     * @description event handler for the cancel button.  emits the editClose event with false.
     * @memberof TaskEditorComponent
     */
    @Click("cancel") private onCancel() {
        this.tasktext = this.tasks.taskText;
        this.editClose.next(false);
    }
}
