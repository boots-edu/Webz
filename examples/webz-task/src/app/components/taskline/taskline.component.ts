import { BindCSSClass, EventSubject, WebzComponent } from "@boots-edu/webz";
import html from "./taskline.component.html";
import css from "./taskline.component.css";
import {
    TaskData,
    TaskeditorComponent,
} from "../taskeditor/taskeditor.component";
import { TaskviewerComponent } from "../taskviewer/taskviewer.component";

/**
 * @description Component for a single task line.
 * @class TaskLineComponent
 * @extends {WebzComponent}
 * @property {EventSubject<void>} lineEdit - event subject for the edit event.
 * @property {EventSubject<boolean>} lineEditClose - event subject for the close event.  true if the save button was clicked, false if the cancel button was clicked.
 * @property {EventSubject<TaskData>} lineDelete - event subject for the delete event.
 * @property {TaskData} data - the task data for the line.
 * @method {disableViewButtons} - disables the view buttons.
 * @method {disableEditing} - disables editing.
 * @method {startEditing} - starts editing.
 * @memberof TaskLineComponent
 */
export class TasklineComponent extends WebzComponent {
    @BindCSSClass("editor") private editorVisible: string = "hidden";
    @BindCSSClass("viewer") private viewerVisible: string = "hidden";

    //event sources
    lineEdit: EventSubject<void> = new EventSubject<void>();
    lineEditClose: EventSubject<boolean> = new EventSubject<boolean>();
    lineDelete: EventSubject<TaskData> = new EventSubject<TaskData>();

    private editor: TaskeditorComponent;
    private viewer: TaskviewerComponent;
    private _editing: boolean = false;
    private set editing(value: boolean) {
        this._editing = value;
        this.editorVisible = value ? "visible" : "hidden";
        this.viewerVisible = value ? "hidden" : "visible";
        this.editor.focusInput();
        this.lineEdit.next();
    }
    private get editing(): boolean {
        return this._editing;
    }

    get data(): TaskData {
        return this.taskData;
    }

    constructor(private taskData: TaskData = { taskText: "" }) {
        super(html, css);
        this.editor = new TaskeditorComponent(taskData);
        this.viewer = new TaskviewerComponent(taskData);
        this.addComponent(this.editor, "editor", true);
        this.addComponent(this.viewer, "viewer", true);
        this.wireUpEditor();
        this.wireUpViewer();
        this.editing = true;
    }
    private wireUpEditor(): void {
        this.editor.editClose.subscribe((save: boolean) => {
            this.editing = false;
            this.viewer.setData(this.taskData);
            this.lineEditClose.next(save);
        });
    }
    private wireUpViewer(): void {
        //if delete is clicked bubble event up.
        //if edit is clicked, then disable all other buttons and enable the editor
        this.viewer.deleting.subscribe(() => {
            this.lineDelete.next(this.taskData);
        });
        this.viewer.editing.subscribe(() => {
            this.lineEdit.next();
            this.editing = true;
        });
    }
    disableViewButtons(disable: boolean = true) {
        this.viewer.disableButtons(disable);
    }
    disableEditing() {
        this.editing = false;
    }
    startEditing() {
        this.editing = true;
    }
}
