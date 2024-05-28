import {
    BindCSSClass,
    BindStyle,
    BindValue,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./hud.component.html";
import css from "./hud.component.css";
import { GameStatus } from "../utils";
import { Globals } from "../../globals";

/**
 * @description The HUD component (Heads up display)
 * @class
 * @extends WebzComponent
 * @method resetFlags - Resets the flags
 * @property {string} Velocity - The velocity of the lander
 * @property {string} flagRotation - The flag for the rotation
 * @property {string} flagDeltaV - The flag for the horizontal velocity
 * @property {string} flagVVelocity - The flag for the vertical velocity
 * @property {string} flagAltitude - The flag for the altitude
 * @property {string} AltitudeMSL - The altitude above mean sea level
 * @property {string} AltitudeTerrain - The altitude above terrain
 * @property {string} Fuel - The fuel remaining
 * @property {string} Time - The time remaining
 * @property {string} Rotation - The rotation of the lander
 * @property {string} status - The status of the lander
 * @
 */
export class HudComponent extends WebzComponent {
    /**
     * @description The velocity of the lander as a vector
     * @type {{x: number; y: number}}
     * @default {x: 0, y: 0}
     * @summary The velocity of the lander as a vector
     */
    public set Velocity(value: { x: number; y: number }) {
        this._horizDeltaV = value.x.toFixed(0);
        this._vertDeltaV = value.y.toFixed(0);
    }

    /** @description The deltaX display value
     * @type {string}
     * @default "0"
     * @summary The deltaX display value
     * @summary Binds to the deltaX element innerHTML
     * @summary Appends " m/s" to the value
     */
    @BindValue("deltax", (value: string) => value + " m/s")
    private _horizDeltaV: string = "0";

    /**
     * @description The deltaY display value
     * @type {string}
     * @default "0"
     * @summary The deltaY display value
     * @summary Binds to the deltaY element innerHTML
     * @summary Appends " m/s" to the value
     */
    @BindValue("deltay", (value: string) => value + " m/s")
    private _vertDeltaV: string = "0";

    /**
     * @description THe rotation display color
     * @type {string}
     * @default "white"
     */
    @BindStyle("rotation", "color")
    private _flagRotation: string = "white";

    /**
     * @description The flag for the rotation
     * @type {boolean}
     * @default false
     * @summary The flag for the rotation
     * @summary Sets the color of the rotation display text
     */
    public set flagRotation(value: boolean) {
        this._flagRotation = value ? "red" : "white";
    }

    /**
     * @description The color of the horizontal velocity display text
     * @type {string}
     * @default "white"
     * @summary The color of the horizontal velocity display text
     * @summary Sets the color of the horizontal velocity display text
     */
    @BindStyle("deltax", "color")
    private _flagDeltaV: string = "white";

    /**
     * @description The flag for the horizontal velocity
     * @type {boolean}
     * @default false
     * @summary The flag for the horizontal velocity
     * @summary Sets the color of the horizontal velocity display text
     */
    public set flagHVelocity(value: boolean) {
        this._flagDeltaV = value ? "red" : "white";
    }

    /**
     * @description The color of the vertical velocity display text
     * @type {string}
     * @default "white"
     * @summary The color of the vertical velocity display text
     * @summary Sets the color of the vertical velocity display text
     */
    @BindStyle("deltay", "color")
    private _flagVVelocity: string = "white";

    /**
     * @description The flag for the vertical velocity
     * @type {boolean}
     * @default false
     * @summary The flag for the vertical velocity sets the color of the vertical velocity display text to red or white
     */
    public set flagVVelocity(value: boolean) {
        this._flagVVelocity = value ? "red" : "white";
    }

    /**
     * @description The color for the altitude above terrain
     * @type {string}
     * @default false
     */
    @BindStyle("altitudeterrain", "color")
    private _flagAltitude: string = "white";

    /**
     * @description The flag for the altitude
     * @type {boolean}
     * @default false
     * @summary The flag for the altitude sets the color of the altitude display text to red or white
     */
    public set flagAltitude(value: boolean) {
        this._flagAltitude = value ? "red" : "white";
    }

    /**
     * @description The altitude above mean sea level
     * @type {string}
     * @default 0
     * @summary The altitude above mean sea level
     * @summary Binds to the altitude above mean sea level element innerHTML
     * @summary Appends " m" to the value
     */
    @BindValue("altitudemsl", (value: string) => value + " m")
    private _altMSL: string = "0";

    /**
     * @description The altitude above msl
     * @type {number}
     * @summary The altitude above msl
     */
    public set AltitudeMSL(value: number) {
        this._altMSL = value.toFixed(0);
    }

    /**
     * @description The altitude above terrain
     * @type {string}
     * @default 0
     * @summary The altitude above terrain
     * @summary Binds to the altitude above terrain element innerHTML
     * @summary Appends " m" to the value
     */
    @BindValue("altitudeterrain", (value: string) => value + " m")
    private _altTerain: string = "0";

    /**
     * @description The altitude above terrain
     * @type {number}
     * @summary The altitude above terrain
     */
    public set AltitudeTerrain(value: number) {
        this._altTerain = value.toFixed(0);
    }

    /**
     * @description The fuel remaining warning color
     * @type {string}
     * @memberof HudComponent
     * @summary Turns yellow or red on low fuel
     * @summary Binds to the fuel element className
     */
    @BindCSSClass("fuel")
    private _fuelWarning: string = "";

    /**
     * @description The fuel remaining
     * @type {string}
     * @default "0"
     * @summary The fuel remaining
     * @summary Binds to the fuel element innerHTML
     * @summary Appends " lbs" to the value
     */
    @BindValue("fuel", (value: string) => value + " lbs")
    private _fuel: string = Globals.LANDER_FUEL_CAPACITY.toString();

    /**
     * @description The Fuel level
     * @type {number}
     * @summary The fuel level of the lander
     * @summary Sets the fuel level of the lander and sets the fuel warning color
     */
    public set Fuel(value: number) {
        if (value < 10) {
            this._fuelWarning = "danger";
        } else if (value < 40) {
            this._fuelWarning = "warning";
        } else this._fuelWarning = "";
        this._fuel = value.toFixed(0);
    }

    /**
     * @description The time elapsed
     * @type {string}
     * @default "0"
     * @summary The time elapsed
     * @summary Binds to the time element innerHTML
     * @summary Appends " s" to the value
     */
    @BindValue("time", (value: string) => value + " s")
    private _time: string = "0";

    /**
     * @description The time elapsed
     * @type {number}
     * @summary The time elapsed
     */
    public set Time(value: number) {
        this._time = value.toFixed(0);
    }

    /**
     * @description The rotation of the lander
     * @type {string}
     * @default "0"
     * @summary The rotation of the lander
     * @summary Binds to the rotation element innerHTML
     */
    @BindValue("rotation")
    private _rotation: string = "0";

    /**
     * @description The rotation of the lander
     * @type {number}
     * @summary The rotation of the lander
     */
    public set Rotation(value: number) {
        let val = value.toFixed(0);
        if (value > 180) val = (value - 360).toFixed(0);
        this._rotation = val;
    }

    /**
     * @description The status of the lander
     * @type {string}
     * @default "Waiting..."
     * @summary The status of the lander
     * @summary Binds to the status element innerHTML
     */
    @BindValue("status")
    private _status: string = "Waiting...";

    /**
     * @description The status of the lander
     * @type {GameStatus}
     * @summary The status of the lander
     */
    public set status(value: GameStatus) {
        if (value === GameStatus.Crash) {
            this._status = "Crashed";
        } else if (value === GameStatus.Orbit) {
            this._status = "Orbit";
        } else if (value === GameStatus.Miss) {
            this._status = "Missed";
        } else if (value === GameStatus.Land) {
            this._status = "Landed";
        } else {
            this._status = "Flying";
        }
    }

    /**
     * @description The constructor of the HudComponent
     * @summary Creates the HUD component
     * @memberof HudComponent
     * @constructor
     */
    constructor() {
        super(html, css);
    }

    /**
     * @description Resets the flags
     * @summary Resets the flags (background colors of all items)
     * @memberof HudComponent
     */
    resetFlags() {
        this.flagAltitude = false;
        this.flagHVelocity = false;
        this.flagRotation = false;
        this.flagVVelocity = false;
    }
}
