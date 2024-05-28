import { WebzComponent } from "../../WebzComponent";
import { BindList } from "../../bind.decorators";
import { Change, Input, ValueEvent } from "../../event.decorators";

const html = `
<ul><li id="list1"></ul>
<ol><li id="list2"></ol>
<div><input type="checkbox" id="checkbox1" /></div>
<div><input type="radio" id="radio1" /></div>
<div><div id="div1"><div>hello world</div></div></div>
<div><div id="div2"><input type="radio" id="val1" /><span id="val2"></div></div>
`;
const css = "";

export class TestComponent2 extends WebzComponent {
    //events
    @BindList("list1")
    @BindList("list2")
    testList1: string[] = ["hello", "world"];

    @BindList("checkbox1", (v: number[]) =>
        v.map((item) => "Item " + item.toString()),
    )
    testList2: number[] = [1, 2, 3];

    @BindList("radio1")
    testList3: string[] = ["hello", "world"];

    @BindList("div1")
    @BindList("div2", undefined, false, ["val1", "val2"])
    testList4: string[] = ["I", "am", "a", "list"];

    constructor() {
        super(html, css);
    }
    testVal1: string = "";
    @Input("radio1")
    onCheckboxChange(e: ValueEvent) {
        this.testVal1 = e.value;
    }
    testval2: string = "";

    @Change("val1")
    onChange(e: ValueEvent) {
        this.testval2 = e.value;
    }
}
