import { WebzComponent } from "../../../WebzComponent";
import {
    BindAttribute,
    BindCSSClass,
    BindStyle,
    BindValue,
} from "../../../bind.decorators";

const html = "<div></div>";
const css = "";

export class BadStyleComponent extends WebzComponent {
    @BindStyle("doesNotExist", "color")
    val: string = "red";

    constructor() {
        super(html, css);
    }
}
export class BadCssComponent extends WebzComponent {
    @BindCSSClass("doesNotExist")
    val: string = "btn";

    constructor() {
        super(html, css);
    }
}
export class BadValueComponent extends WebzComponent {
    @BindValue("doesNotExist")
    val: string = "hello";
    constructor() {
        super(html, css);
    }
}
export class BadAttributeComponent extends WebzComponent {
    @BindAttribute("doesNotExist", "disabled")
    val: string = "true";
    constructor() {
        super(html, css);
    }
}
export class NoRootChildComponent extends WebzComponent {
    constructor() {
        super("<div></div>", css);
    }
}
export class NoRootParentCompnent extends WebzComponent {
    child: NoRootChildComponent = new NoRootChildComponent();
    constructor() {
        super("<div></div>", css);
        this.addComponent(this.child);
    }
}
