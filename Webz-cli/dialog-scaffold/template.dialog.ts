import { WebzDialog, Click } from "@boots/webz";
import html from "./########.dialog.html";
import css from "./########.dialog.css";

export class $$$$$$$$Dialog extends WebzDialog {
    constructor() {
        super(html, css);
    }
    @Click("okBtn")
    private onOk() {
        this.show(false);
    }
}
