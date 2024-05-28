import html from "./main.component.html";
import css from "./main.component.css";
import {
    BindCSSClass,
    BindStyleToNumberAppendPx,
    Click,
    WebzComponent,
    WebzDialog,
} from "@boots-edu/webz";
import { LanderComponent } from "./objects/lander/lander.component";
import { TerrainComponent } from "./objects/terrain/terrain.component";
import { GameStatus } from "./objects/utils";
import { HudComponent } from "./objects/hud/hud.component";

/**
 * Main Component
 * @description The main component of the game
 * @class
 * @extends WebzComponent
 * @method startGame - Starts the game
 * @method setupGame - Sets up the game
 * @property {LanderComponent} lander - The lander object
 * @property {TerrainComponent} terrain - The terrain object
 * @property {HudComponent} hud - The hud object
 */
export class MainComponent extends WebzComponent {
    lander: LanderComponent;
    terrain: TerrainComponent;
    hud: HudComponent = new HudComponent();

    /**
     * @description The height of the terrain
     * @type {string}
     * @default "150"
     * @summary The height of the terrain
     * @summary Binds to the terrain component's height
     * @summary Appends "px" to the value
     */
    @BindStyleToNumberAppendPx("terrain", "height")
    private _terrainHeight: number = 150;

    /**
     * @description The class of the start button (for disabling)
     * @type {string}
     * @default ""
     * @summary The class of the start button
     * @summary Binds to the start button's class (adds disableContent)
     */
    @BindCSSClass("start")
    private _startClass: string = "";

    /**
     * @description The constructor of the MainComponent
     * @summary Creates the main component
     * @memberof MainComponent
     * @constructor
     */
    constructor() {
        super(html, css);
        this.terrain = new TerrainComponent(this._terrainHeight);
        this.lander = new LanderComponent(this.terrain.terrainItems, this.hud);
        this.addComponent(this.terrain, "terrain");
        this.addComponent(this.lander, "content");
        this.addComponent(this.hud, "hud");
        this.setupGame();
    }

    /**
     * @description Starts the game
     * @summary Starts the game
     * @method
     * @memberof MainComponent
     * @summary Binds to start button click event
     */
    @Click("start")
    startGame() {
        if (this._startClass === "disabledContent") return;
        this._startClass = "disabledContent";
        this.lander.startFlying();
    }

    /**
     * @description Sets up the game
     * @summary Sets up the game.  Shows the help screen, then subscribes to the game over event
     * @method
     * @memberof MainComponent
     * @async
     */
    async setupGame() {
        await WebzDialog.popup(
            this,

            "Use the <em><b>'A'</b></em> and <em><b>'D'</b></em> keys to rotate the lander.<br/> Use the 'Space Bar' to thrust. <br/>Land on a flat area!<br/><br/>Good Luck!!!",
            "Welcome to Lunar Lander!",
            ["Play Game"],
            "btn btn-success",
        ).toPromise();

        this.lander.gameOver.subscribe((status) => {
            let title: string = "";
            if (status === GameStatus.Crash) {
                title = "You crashed!";
            } else if (status === GameStatus.Orbit) {
                title = "You have achieved escape velocity!";
            } else if (status === GameStatus.Miss) {
                title = "You left the landing zone!";
            } else if (status === GameStatus.Land) {
                title = "You landed!";
            }
            WebzDialog.popup(
                this,
                "Try again?",
                title,
                ["Yes", "No"],
                "btn btn-primary",
            ).subscribe((response: string) => {
                if (response === "Yes") {
                    this._startClass = "";
                    this.startGame();
                } else {
                    this._startClass = "";
                }
            });
        });
    }
}
