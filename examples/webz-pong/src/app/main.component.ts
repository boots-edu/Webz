import html from "./main.component.html";
import css from "./main.component.css";
import {
    BindValue,
    BindStyleToNumberAppendPx,
    Click,
    WebzComponent,
    WebzDialog,
    Timer,
} from "@boots-edu/webz";
import { PaddleComponent } from "./paddle/paddle.component";
import { Globals } from "./globals";
import { BallComponent } from "./ball/ball.component";

/**
 * @description The main component of the game
 * @export
 * @class MainComponent
 * @extends {WebzComponent}
 * @method startGame : event handler for start button
 * @method updateTimer : Main game loop timer
 * @method start : Reset and start a new game
 * @method stop : Stop the game
 */
export class MainComponent extends WebzComponent {
    /**
     * @description The width of the game board
     * @private
     * @type {string}
     * @memberof MainComponent
     * @summary Binds to game-board style.width
     */
    @BindStyleToNumberAppendPx("game-board", "width")
    private boardWidth: number = Globals.BOARD_WIDTH;

    /**
     * @description The height of the game board
     * @private
     * @type {string}
     * @memberof MainComponent
     * @summary Binds to game-board style.height
     */
    @BindStyleToNumberAppendPx("game-board", "height")
    private boardHeight: number = Globals.BOARD_HEIGHT;

    /**
     * @description The paddle component
     * @private
     * @type {PaddleComponent}
     * @memberof MainComponent
     */
    private paddle: PaddleComponent = new PaddleComponent();

    /**
     * @description The ball component
     * @private
     * @type {BallComponent}
     * @memberof MainComponent
     */
    private ball: BallComponent;

    /**
     * @description The start time of the game
     * @private
     * @type {Date}
     * @memberof MainComponent
     * @summary Used to calculate the elapsed time
     */
    private startTime: Date = new Date();

    /**
     * @description Whether the game is currently playing
     * @private
     * @type {boolean}
     * @memberof MainComponent
     */
    private playing: boolean = false;

    /**
     * @description The time elapsed in the game
     * @private
     * @type {string}
     * @memberof MainComponent
     * @summary Binds to timer innerHTML
     */
    @BindValue("timer")
    private time: string = "00:00";

    /**
     * @description Creates an instance of MainComponent.
     * @memberof MainComponent
     * @summary Initializes the game board and components
     * @summary Subscribes to the ball's gameOver event to handle game over
     */
    constructor() {
        super(html, css);
        this.ball = new BallComponent(this.paddle);
        this.addComponent(this.paddle, "game-board");
        this.addComponent(this.ball, "game-board");
        this.ball.gameOver.subscribe(() => {
            this.stop();
            WebzDialog.popup(
                this,
                "Would you like to play again?",
                "Game Over",
                ["Yes", "No"],
                "btn btn-primary",
            ).subscribe((result) => {
                if (result === "Yes") {
                    this.start();
                }
            });
        });
    }

    /**
     * @description Start a new game
     * @memberof MainComponent
     * @summary Resets the game timer and ball
     * @summary Starts the game loop
     */
    start() {
        this.time = "00:00";
        this.startTime = new Date();
        this.playing = true;
        this.ball.restart();
    }
    /**
     * @description Stop the game
     * @memberof MainComponent
     * @summary Stops the game loop
     */
    stop() {
        this.playing = false;
    }

    /**
     * @description Event handler for the start button
     * @memberof MainComponent
     * @summary Starts the game
     * @summary Binds to the go button click event
     */
    @Click("go")
    startGame() {
        this.start();
    }

    /**
     * @description Main game loop timer
     * @memberof MainComponent
     * @summary Updates the game timer every second
     */
    @Timer(1000)
    updateTimer() {
        if (this.playing) {
            const elapsed =
                (new Date().valueOf() - this.startTime.valueOf()) / 1000;
            let minutes: number = Math.floor(elapsed / 60);
            let seconds: number = Math.floor(elapsed % 60);
            this.time =
                minutes.toString().padStart(2, "0") +
                ":" +
                seconds.toString().padStart(2, "0");
        }
    }
}
