import {
    BindStyle,
    BindStyleToNumberAppendPx,
    WebzComponent,
    WindowEvent,
} from "@boots-edu/webz";
import html from "./paddle.component.html";
import css from "./paddle.component.css";
import { Globals } from "../globals";
import { Rectangle } from "../utils/rectangle";

/**
 * @description The paddle component
 * @export
 * @class PaddleComponent
 * @extends {WebzComponent}
 * @method movePaddleUp : Move the paddle up
 * @method movePaddleDown : Move the paddle down
 * @method getPaddleRect : Get the paddle rectangle
 * @method onKeyPress : Event handler for key press
 */
export class PaddleComponent extends WebzComponent {
    /**
     * @description The width of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.width
     */
    @BindStyleToNumberAppendPx("paddle", "width")
    paddle_width: number = Globals.PADDLE_WIDTH;

    /**
     * @description The height of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.height
     */
    @BindStyleToNumberAppendPx("paddle", "height")
    paddle_height: number = Globals.PADDLE_HEIGHT;

    /**
     * @description The x coordinate of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.left
     * @summary Appends px to the value
     */
    @BindStyleToNumberAppendPx("paddle", "left")
    paddle_x: number = Globals.PADDLE_INDENT;

    /**
     * @description The y coordinate of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.top
     * @summary Appends px to the value
     */
    @BindStyleToNumberAppendPx("paddle", "top")
    paddle_y: number = 0;

    /**
     * @description The color of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.backgroundColor
     */
    @BindStyle("paddle", "backgroundColor")
    private _paddle_color: string = Globals.PADDLE_COLOR;

    /**
     * @description The speed of the paddle
     * @private
     * @type {number}
     * @memberof PaddleComponent
     */
    private paddle_speed: number = Globals.PADDLE_SPEED;

    /**
     * @description The maximum y coordinate of the paddle
     * @private
     * @type {number}
     * @memberof PaddleComponent
     */
    private get maxY(): number {
        return Globals.BOARD_HEIGHT - this.paddle_height;
    }

    /**
     * @description The constructor for the paddle component
     * @memberof PaddleComponent
     * @summary Initializes the paddle component
     */
    constructor() {
        super(html, css);
        this.paddle_y = (Globals.BOARD_HEIGHT - this.paddle_height) / 2;
    }

    /**
     * @description Move the paddle up
     * @memberof PaddleComponent
     */
    movePaddleUp() {
        this.paddle_y = Math.max(0, this.paddle_y - this.paddle_speed);
    }

    /**
     * @description Move the paddle down
     * @memberof PaddleComponent
     */
    movePaddleDown() {
        this.paddle_y = Math.min(this.maxY, this.paddle_y + this.paddle_speed);
    }

    /**
     * @description Get the paddle rectangle
     * @returns {Rectangle}
     * @memberof PaddleComponent
     */
    getPaddleRect(): Rectangle {
        return {
            x: this.paddle_x,
            y: this.paddle_y,
            width: this.paddle_width,
            height: this.paddle_height,
        };
    }

    /**
     * @description Event handler for key press
     * @param {KeyboardEvent} event
     * @memberof PaddleComponent
     * @summary Binds to the window keydown event
     * @summary Moves the paddle up or down based on the key pressed
     * @summary Moves the paddle up when the "a" key is pressed
     * @summary Moves the paddle down when the "z" key is pressed
     */
    @WindowEvent("keydown")
    onKeyPress(event: KeyboardEvent) {
        if (event.key === "a") {
            this.movePaddleUp();
        } else if (event.key === "z") {
            this.movePaddleDown();
        }
    }
}
