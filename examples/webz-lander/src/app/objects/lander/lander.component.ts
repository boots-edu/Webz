import html from "./lander.component.html";
import css from "./lander.component.css";
import {
    BindStyle,
    BindStyleToNumberAppendPx,
    Notifier,
    WebzComponent,
    Timer,
    WindowEvent,
} from "@boots-edu/webz";
import { Globals } from "../../globals";
import { GameStatus, Position } from "../utils";
import { TerrainItem } from "../terrain/terrain.component";
import { HudComponent } from "../hud/hud.component";

/**
 * @description The Lander Component
 * @class
 * @extends WebzComponent

 * @property {Notifier<GameStatus>} gameOver - The game over event
 */
export class LanderComponent extends WebzComponent {
    /**
     * @description The lander image
     * @type {string}
     * @default "assets/lander.png"
     * @private
     */
    @BindStyle(
        "lander",
        "backgroundImage",
        (value: string) => `url(${value}?v=${new Date().valueOf()})`,
    )
    private _landerImg: string = "assets/lander.png";

    /** @description Various lander stats
     * @private
     * @memberof LanderComponent
     */
    private landerWidth = 65;
    private landerHeight = 60;
    private fuel = 0;

    /**
     * @description The start time for elapsed time calculation
     * @private
     */
    private startTime: Date = new Date();

    /**
     * @description The x position of the lander
     * @type {string}
     * @default "0"
     * @private
     * @summary Binds to the lander's style.left
     */
    @BindStyleToNumberAppendPx("lander", "left")
    private _xPos: number = 0;

    /**
     * @description The y position of the lander
     * @type {string}
     * @default "0"
     * @private
     * @summary Binds to the lander's style.top
     */
    @BindStyleToNumberAppendPx("lander", "top")
    private _yPos: number = 0;

    /**
     * @description The position of the lander
     * @returns {Position} The position of the lander
     * @private
     * @memberof LanderComponent
     * @summary Gets the position of the lander in screen coordinates
     */
    private get position(): Position {
        return { x: this._xPos, y: this._yPos };
    }

    /**
     * @description Sets the position of the lander
     * @param {Position} value The new position
     * @private
     * @memberof LanderComponent
     * @summary Sets the position of the lander in screen coordinates within the game div
     */
    private set position(value: Position) {
        this._xPos = value.x;
        this._yPos = value.y;
    }

    /**
     * @description The world position of the lander
     * @returns {Position} The world position of the lander
     * @private
     * @memberof LanderComponent
     * @summary Gets the position of the lander in world coordinates origin lower left
     */
    private get worldPosition(): Position {
        //Note: 50 is the title height
        //12 is the height of the flame
        return {
            x: this.position.x,
            y:
                this.getWindowSize().windowHeight -
                50 -
                this.position.y -
                this.landerHeight +
                12,
        };
    }

    /**
     * @description The rotation transform for the lander
     * @type {string}
     * @default "0"
     * @private
     * @summary Binds to the lander's style.transform
     * @memberof LanderComponent
     * @default "rotate(0 deg)"
     */
    @BindStyle("lander", "transform")
    private _transform: string = "rotate(0 deg)";

    /**
     * @description The rotation of the lander in degrees
     * @type {number}
     * @default 0
     * @private
     * @memberof LanderComponent
     */
    private _angle: number = 0;

    /**
     * @description Set The rotation of the lander in degrees
     * @type {number} The rotation of the lander in degrees
     * @private
     * @memberof LanderComponent
     */
    set rotation(value: number) {
        if (value < 0) value = 360 + value;
        if (value > 360) value = value % 360;
        this._angle = value;
        this._transform = `rotate(${value}deg)`;
    }

    /**
     * @description Get The rotation of the lander in degrees
     * @returns {number} The rotation of the lander in degrees
     * @private
     * @memberof LanderComponent
     */
    get rotation(): number {
        return this._angle;
    }

    /**
     * @description The flame display
     * @type {string}
     * @default "none"
     * @private
     * @memberof LanderComponent
     * @summary Binds to the flame's style.display : show or hide
     */
    @BindStyle("flame", "display")
    private _flameDisplay: string = "none";

    /**
     * @description Set The flame display
     * @param {boolean} value The flame display
     * @memberof LanderComponent
     * @summary Sets the flame display to show or hide
     * @private
     */
    private set flameDisplay(value: boolean) {
        this._flameDisplay = value ? "block" : "none";
    }

    /**
     * @description Get The flame display
     * @returns {boolean} The flame display
     * @private
     * @memberof LanderComponent
     * @summary Gets the flame display
     */
    private get flameDisplay(): boolean {
        return this._flameDisplay === "block";
    }

    /**
     * @description The velocity of the lander
     * @type {Position}
     * @private
     * @memberof LanderComponent
     */
    private velocity: Position = { x: 0, y: 0 };

    /**
     * @description The display of the lander (block or none)
     * @type {string}
     * @default "none"
     * @private
     * @memberof LanderComponent
     * @summary Binds to the lander's style.display : show or hide
     */
    @BindStyle("lander", "display")
    private _showLander: string = "none";

    /**
     * @description Get The display of the lander (block or none)
     * @returns {boolean} The display of the lander
     * @private
     * @memberof LanderComponent
     */
    public get showLander(): boolean {
        return this._showLander === "block";
    }

    /**
     * @description Set The display of the lander (block or none)
     * @param {boolean} value The display of the lander
     * @memberof LanderComponent
     * @summary Sets the display of the lander to show or hide
     * @private
     */
    public set showLander(value: boolean) {
        this._showLander = value ? "block" : "none";
    }

    /**
     * @description The altitude above the terrain
     * @type {number}
     * @private
     * @memberof LanderComponent
     */
    get altitudeTerrain(): number {
        return this.getAltitudeAt(this.position.x + this.landerWidth / 2);
    }

    /**
     * @description boolean as to whether the game is active
     * @type {TerrainItem[]}
     * @private
     * @memberof LanderComponent
     */
    private flying: boolean = false;

    /**
     * @description The game over event
     * @type {Notifier<GameStatus>}
     * @private
     * @memberof LanderComponent
     */
    gameOver: Notifier<GameStatus> = new Notifier<GameStatus>();

    /**
     * @description The terrain altitude
     * @type {number}
     * @private
     * @memberof LanderComponent
     */
    constructor(
        private _terrain: TerrainItem[],
        private hud: HudComponent,
    ) {
        super(html, css);
        this.position = { x: 50, y: 50 };
    }

    /**
     * @description Stops the flame
     * @param {KeyboardEvent} event The keyboard event
     * @method
     * @memberof LanderComponent
     * @summary Stops the flame on a space bar keyup event
     */
    @WindowEvent("keyup")
    stopFlame(event: KeyboardEvent) {
        if (event.key === " ") {
            this.flameDisplay = false;
        }
    }

    /**
     * @description Moves and flames the lander
     * @param {KeyboardEvent} event The keyboard event
     * @method
     * @memberof LanderComponent
     * @summary Rotate the lander left or right and apply thrust by turning
     * on the flame
     */
    @WindowEvent("keydown")
    moveAndFlame(event: KeyboardEvent) {
        if (this.flying) {
            switch (event.key) {
                case "a":
                case "A":
                    this.rotation -= Globals.LANDER_ROTATION_SPEED;
                    break;
                case "d":
                case "D":
                    this.rotation += Globals.LANDER_ROTATION_SPEED;
                    break;
                case " ":
                    this.flameDisplay = this.fuel > 0;
                    break;
            }
        }
    }

    /**
     * @description Tests the velocity of the lander
     * @returns {boolean} Whether the velocity is slow enough to land
     * @private
     * @memberof LanderComponent
     */
    velocityTest(): boolean {
        return (
            Math.abs(this.velocity.x) < Globals.TERRAIN_GOOD_VELOCITYX &&
            Math.abs(this.velocity.y) < Globals.TERRAIN_GOOD_VELOCITYY
        );
    }

    /**
     * @description Main loop Updates the position of the lander
     * @method
     * @memberof LanderComponent
     * @summary Updates the position of the lander based on thrust, gravity and collision detection
     * @summary Stops the game if the lander crashes, lands, orbits or misses
     * @summary Binds to timer event every 100ms
     *      * @private
     */
    @Timer(100)
    private UpdatePosition() {
        if (this.flying) {
            //shouldn't happen after collision detection
            if (this.position.y > this.getWindowSize().windowHeight) {
                this.stopFlying(GameStatus.Crash);
                return;
            }
            //thrust
            //this is title height+lander height+20
            if (this.position.y < -50) {
                this.stopFlying(GameStatus.Orbit);
                return;
            }
            if (
                this.position.x > this.getWindowSize().windowWidth - 65 ||
                this.position.x < 0
            ) {
                this.stopFlying(GameStatus.Miss);
                return;
            }
            if (this.flameDisplay && this.fuel > 0) {
                this.velocity.x +=
                    Math.sin((this.rotation * Math.PI) / 180) *
                    Globals.THRUST_MULTIPLIER;
                this.velocity.y -=
                    Math.cos((this.rotation * Math.PI) / 180) *
                    Globals.THRUST_MULTIPLIER;
                this.fuel -= Globals.LANDER_FUEL_CONSUMPTION;
            }
            this.hud.Fuel = this.fuel;
            //gravity
            this.velocity.y += Globals.GRAVITY;
            this.hud.Velocity = this.velocity;
            this.position = {
                x: this.position.x + this.velocity.x,
                y: this.position.y + this.velocity.y,
            };
            this.hud.AltitudeMSL = this.worldPosition.y;
            this.hud.AltitudeTerrain = this.altitudeTerrain;
            this.hud.Rotation = this.rotation;
            this.hud.Time = Math.floor(
                (new Date().getTime() - this.startTime.getTime()) / 1000,
            );

            //collision detection
            if (this.altitudeTerrain <= 0) {
                this.hud.AltitudeTerrain = 0;
                const midX = this.position.x + this.landerWidth / 2;
                this.position = {
                    x: this.position.x,
                    y:
                        this.getWindowSize().windowHeight -
                        this.getTerrainHeightAt(midX) -
                        50 -
                        this.landerHeight +
                        12,
                };
                let y1 = this.getAltitudeAt(this.position.x);
                let y2 = this.getAltitudeAt(this.position.x + this.landerWidth);
                if (this.rotation != 0) {
                    this.hud.flagRotation = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                    return;
                } else if (this.velocity.x > Globals.TERRAIN_GOOD_VELOCITYX) {
                    this.hud.flagHVelocity = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else if (this.velocity.y > Globals.TERRAIN_GOOD_VELOCITYY) {
                    this.hud.flagVVelocity = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else if (
                    Math.abs(y1 - y2) > Globals.TERRAIN_GOOD_DIFFERENCE
                ) {
                    this.hud.flagAltitude = true;
                    //show explosion
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else {
                    this.stopFlying(GameStatus.Land);
                }
            }
        }
    }

    /**
     * @description Resets the HUD
     * @method
     * @memberof LanderComponent
     */
    private resetHud() {
        this.hud.Rotation = this.rotation;
        this.hud.Velocity = this.velocity;
        this.hud.status = GameStatus.Ok;
        this.hud.AltitudeMSL = this.position.y;
        this.hud.AltitudeTerrain = this.position.y;
        this.hud.Fuel = this.fuel;
        this.hud.Time = 0;
        this.hud.resetFlags();
    }

    /**
     * @description Starts the lander flying
     * @method
     * @memberof LanderComponent
     * @summary Starts the lander flying with a random x position
     */
    startFlying() {
        this._landerImg = "assets/lander.png";
        this.startTime = new Date();
        this.rotation = 0;
        this.velocity = { x: 0, y: 0 };
        const randomX = Math.floor(
            Math.random() * (this.getWindowSize().windowWidth - 100 + 1) + 50,
        );
        this.position = { x: randomX, y: 50 };
        this.fuel = Globals.LANDER_FUEL_CAPACITY;
        this.resetHud();
        this.flying = true;
        this.showLander = true;
    }
    private stopFlying(stopType: GameStatus) {
        this.flying = false;
        this.hud.status = stopType;
        this.gameOver.notify(stopType);
    }

    /**
     * @description Gets the altitude above the terrain at a given x position
     * @param {number} x The x position
     * @returns {number} The altitude at the x position
     * @method
     * @memberof LanderComponent
     */
    private getAltitudeAt(x: number): number {
        const terrain =
            this._terrain[Math.floor(x / Globals.TERRAIN_PART_WIDTH)];
        return this.worldPosition.y - terrain.height + terrain.getYatX(x);
    }

    /**
     * @description Gets the terrain height at a given x position
     * @param {number} x The x position
     * @returns {number} The terrain height at the x position
     * @method
     * @memberof LanderComponent
     */
    private getTerrainHeightAt(x: number): number {
        return this._terrain[
            Math.floor(x / Globals.TERRAIN_PART_WIDTH)
        ].getHeightatX(x);
    }
}
