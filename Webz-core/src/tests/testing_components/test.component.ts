import { WebzComponent } from "../../WebzComponent";
import {
    BindAttribute,
    BindCSSClass,
    BindCSSClassToBoolean,
    BindDisabledToBoolean,
    BindCheckedToBoolean,
    BindStyle,
    BindStyleToNumber,
    BindStyleToNumberAppendPx,
    BindValue,
    BindVisibleToBoolean,
} from "../../bind.decorators";
import {
    Click,
    GenericEvent,
    Blur,
    Change,
    Input,
    Timer,
    WindowEvent,
    ValueEvent,
} from "../../event.decorators";
import { TestChild1Component } from "./test-child1.component";
import { TestChild2Component } from "./test-child2.component";

const html = `<div id="child1"></div>
<div id="child2"></div>
<div id="child3"></div>
<div id="child4"></div>
<button id="evtButton1"></button>
<button id="evtButton2"></button>
<button id="evtButton3"></button>
<div id="evtDiv1"></div>
<div id="evtDiv2"></div>
<div id="evtDiv3"></div>
<input type="text" id="evtInput1" />
<input type="text" id="evtInput3" />
<input type="text" id="bindInput1" />
<input type="text" id="bindInput2" />
<input type="text" id="bindInput3" />
<div id="bindDiv1"></div>
<div id="bindDiv2"></div>
<div id="bindDiv3"></div>
<div id="bindDiv4"></div>
<div id="bindDiv5"></div>
<div id="bindDiv6"></div>
<div id="bindDiv7"></div>
<div id="bindDiv8"></div>
<div id="bindDiv9"></div>
<div id="bindDiv10"></div>
<div id="bindDiv11"></div>
<div id="bindDiv12"></div>
<div id="bindDiv13"></div>
<div id="bindDiv14"></div>
<div id="bindDiv15"></div>
<div id="bindDiv16"></div>
<div id="bindDiv17" class="initial"></div>
<div id="bindDiv18"></div>
<div id="bindDiv19"></div>
<div id="bindDiv20"></div>
<div id="bindDiv21"></div>
<button id="bindBtn22"></button>
<div id="bindDiv23"></div>
<textarea id="bindTa1"></textarea>
<select id="bindSel1">
    <option id="bindOpt1" value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
</select>
<textarea id="bindTa2"></textarea>
<select id="bindSel2">
    <option id="bindOpt2" value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
</select>
<div id="styleDiv1"></div>
<div id="styleDiv2"></div>
<div id="styleDiv3"></div>
<div id="styleDiv4"></div>
<button id="attribBtn1"></button>
<button id="attribBtn2"></button>
<button id="attribBtn3"></button>
<button id="attribBtn4"></button>
<img id="attribImg1" />
<img id="attribImg2" />
<div id="attribDiv1"></div>
<div id="attribDiv2"></div>
<div id="covDiv1"></div>
<input type="text" id="covInp1"></input>
<input type="text" id="bindNumber1"></input>
<textarea id="ta1">Hootie</textarea>
<select id="sel1">
    <option id="opt1" value="1">1</option>
    <option id="opt2" value="2">1</option>
</select>
<input type="checkbox" id="bindCheck24" />
<input type="checkbox" id="bindCheck25" />
`;
const css = "";

export class TestComponent extends WebzComponent {
    child1: TestChild1Component = new TestChild1Component();
    child2: TestChild1Component = new TestChild1Component();
    child3: TestChild1Component = new TestChild1Component();
    child4: TestChild2Component = new TestChild2Component();
    //events
    testVal: boolean = false;
    testVal2: boolean = false;
    testVal3: number = 0;
    testVal4: string = "";

    @BindStyle("styleDiv1", "color")
    testStyle1: string = "red";

    @BindStyleToNumberAppendPx("styleDiv4", "width")
    testStyle4: number = 100;

    @BindStyle("styleDiv2", "color")
    @BindStyle("styleDiv3", "color")
    testStyle2: string = "blue";

    @BindValue("bindDiv1")
    testbind1: string = "hello";

    @BindValue("bindInput1")
    testbind2: string = "hello";
    @Input("bindInput1")
    testbind2Change(event: Event) {
        this.testbind2 = (event.target as HTMLInputElement).value;
    }

    @BindValue("bindDiv2")
    @BindValue("bindDiv3")
    testbind3: string = "hello";

    @BindValue("bindDiv4")
    @BindValue("bindDiv5")
    @BindValue("bindInput2")
    testbind4: string = "hello";

    @Input("bindInput2")
    testbind4Change(event: Event) {
        this.testbind4 = (event.target as HTMLInputElement).value;
    }
    @BindStyleToNumber("bindNumber1", "width")
    testbind8: number = 5;

    @BindCSSClass("bindDiv6")
    testbind5: string = "hello";
    @BindCSSClass("bindDiv7")
    @BindCSSClass("bindDiv8")
    testbind6: string = "hello";

    @BindValue("bindDiv9", (val: string) => `$$$${val} ${"World!!!"}`)
    @BindValue("bindDiv10", (val: string) => `$$$${val} ${"World!!!"}`)
    testbind7: string = "hello";

    @BindCSSClass("bindDiv11")
    @BindCSSClass("bindDiv12")
    testcss1: string = "btn";

    @BindCSSClass("bindDiv13")
    testcss2: string = "btn";

    @BindCSSClassToBoolean("bindDiv14", "title")
    testcss3: boolean = true;

    @BindCSSClassToBoolean("bindDiv15", "title")
    testcss4: boolean = false;

    @BindCSSClassToBoolean("bindDiv15", "title")
    @BindCSSClassToBoolean("bindDiv15", "header")
    testcss5: boolean = false;

    @BindCSSClassToBoolean("bindDiv16", "title")
    @BindCSSClassToBoolean("bindDiv16", "header")
    testcss6: boolean = true;
    @BindCSSClassToBoolean("bindDiv17", "title")
    testcss7: boolean = false;

    @BindAttribute("attribBtn1", "disabled", (val: boolean) =>
        val ? "disabled" : "",
    )
    testAttrib1: boolean = false;

    @BindAttribute("attribBtn2", "disabled", (val: boolean) =>
        val ? "disabled" : "",
    )
    testAttrib3: boolean = true;

    @BindAttribute("attribBtn4", "disabled", (val: boolean) =>
        val ? "disabled" : "",
    )
    @BindAttribute("attribBtn3", "disabled", (val: boolean) =>
        val ? "disabled" : "",
    )
    testAttrib5: boolean = true;

    @BindAttribute("attribImg1", "src")
    @BindValue("attribDiv1")
    testAttrib2: string = "https://www.google.com";

    @BindValue("attribDiv1")
    @BindAttribute("attribImg1", "src")
    testAttrib6: string = "https://www.google.com";

    timerTest1: number = 0;
    @BindValue("bindTa1")
    testTa1: string = "hello";

    @BindValue("bindSel1")
    testSel1: string = "2";

    @BindValue("bindOpt1")
    testOpt1: string = "99";

    @BindValue("bindInput3")
    @BindValue("bindDiv21")
    testInput3: string = "hello";

    @BindValue("bindTa2")
    @BindValue("bindDiv18")
    testTa2: string = "hello";

    @BindValue("bindSel2")
    @BindValue("bindDiv19")
    testSel2: string = "2";

    @BindValue("bindOpt2")
    @BindValue("bindDiv20")
    testOpt2: string = "99";

    @BindDisabledToBoolean("bindBtn22")
    testDisabled1: boolean = true;

    @BindVisibleToBoolean("bindDiv23")
    testVisible1: boolean = false;

    @BindCheckedToBoolean("bindCheck24")
    testChecked1: boolean = true;

    testVal5: string = "";
    @BindCheckedToBoolean("bindCheck25")
    testChecked2: boolean = true;

    constructor() {
        super(html, css);
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child3, "child3");
        this.addComponent(this.child4, "child4", true);
    }

    fn: () => void = () => {};
    @Timer(1000)
    testTimer(kill: () => void) {
        this.fn();
        this.timerTest1++;
        if (this.timerTest1 >= 5) kill();
    }
    @Click("evtButton2")
    @Click("evtDiv2")
    evtDiv2Click() {
        this.testVal3++;
    }
    @Click("evtDiv1")
    evtDiv1Click() {
        this.testVal2 = !this.testVal2;
    }
    @Click("evtButton1")
    evtbutton1Click() {
        this.testVal = !this.testVal;
    }
    @GenericEvent("evtInput1", "change")
    @Blur("evtInput1")
    @Change("evtInput1")
    @Input("evtInput1")
    evtInput1Change(event: Event) {
        this.testVal4 = (event.target as HTMLInputElement).value;
    }

    evtTest: boolean = false;
    @Click("evtButton3")
    evtbutton2Click() {
        this.evtTest = !this.evtTest;
    }
    @GenericEvent("evtInput3", "focus")
    evtInput1Event() {
        this.evtTest = !this.evtTest;
    }

    @WindowEvent("resize")
    windowResize(event: UIEvent) {
        event.preventDefault();
    }
    @Change("bindCheck24")
    evtCheck24Change(event: ValueEvent) {
        this.testVal5 = event.value;
    }
    @Change("bindCheck25")
    evtCheck25Change(event: ValueEvent) {
        this.testChecked2 = event.value === "on";
    }
}
