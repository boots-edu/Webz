import { WebzComponent } from "../../WebzComponent";
import { TestGrandchildComponent } from "./test-grandchild.component";

const html = `<p>TestChild1 Component</p>
<div id="baby1"></div>
<div id="baby2"></div>
`;
const css = "";

export class TestChild1Component extends WebzComponent {
    baby1: TestGrandchildComponent = new TestGrandchildComponent();
    baby2: TestGrandchildComponent = new TestGrandchildComponent();

    constructor() {
        super(html, css);
        this.addComponent(new TestGrandchildComponent(), "root", true);
        this.addComponent(this.baby1, "baby1", true);
        this.addComponent(this.baby2, "baby2", true);
        this.addComponent(new TestGrandchildComponent(), "baby2", true);
        this.addComponent(new TestGrandchildComponent(), "root", true);
        let gonner = new TestGrandchildComponent();
        this.addComponent(gonner, "root");
        this.removeComponent(gonner);
    }
}
