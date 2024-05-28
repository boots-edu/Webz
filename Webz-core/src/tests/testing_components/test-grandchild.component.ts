import { WebzComponent } from "../../WebzComponent";
import { Click } from "../../event.decorators";
const html = `<button id="evtButton1"></button>`;
const css = "";

export class TestGrandchildComponent extends WebzComponent {
    testVal: boolean = false;
    constructor() {
        super(html, css);
    }

    @Click("evtButton1")
    evtbutton1Click() {
        this.testVal = !this.testVal;
    }
}
