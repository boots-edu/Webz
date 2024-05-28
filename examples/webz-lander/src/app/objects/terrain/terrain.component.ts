import { WebzComponent } from "@boots-edu/webz";
import html from "./terrain.component.html";
import css from "./terrain.component.css";
import { Globals } from "../../globals";

/**
 * @description A function to get a random integer between two numbers
 * @param {number} min - The minimum number
 * @param {number} max - The maximum number
 * @returns {number} - A random number between min and max
 * @function
 */
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * @description A terrain item class
 * @class
 * @extends WebzComponent
 */
export class TerrainItem extends WebzComponent {
    /**
     * @description the top left corner of the polygon
     */
    public x1: number = 0;
    public y1: number = 0;
    /**
     * @description the bottom right corner of the polygon
     */
    public x2: number = 0;
    public y2: number = 0;

    /**
     * @description The constructor of the TerrainItem
     * @summary Creates a terrain item
     * @memberof TerrainItem
     * @constructor
     */
    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        public height: number,
    ) {
        super(
            `<div id='holder'>
               <svg>
               <defs>
                        <pattern id="image" x="0" y="0" patternUnits="userSpaceOnUse" height="500" width="500">
                        <image x="0" y="0" xlink:href="assets/ground.jpg"></image>
                    </pattern>
                </defs>
                <polygon class="terrain" points='0 ${height},0 ${y1},${x2 - x1} ${y2},${x2 - x1} ${height}' 
                    style='fill:url(#image);stroke:black;stroke-width:0'>
                </polygon>
            </svg></g></svg></div>`,
            `#holder{
                position: absolute;
                top: 0;
                left:${x1}px;
                width:${x2 - x1}px;
                height:${height}px;               
                `,
        );
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    /**
     * @description Gets the y value at a given x
     * @param {number} x - The x value
     * @returns {number} - The y value at x
     * @method
     * @memberof TerrainItem
     */
    getYatX(x: number): number {
        let slope = (this.y2 - this.y1) / (this.x2 - this.x1);
        return slope * (x - this.x1) + this.y1;
    }

    /**
     * @description Gets the height of the terrain at a given x
     * @param {number} x - The x value
     * @returns {number} - The height at x
     * @method
     * @memberof TerrainItem
     */
    getHeightatX(x: number): number {
        return this.height - this.getYatX(x);
    }
}

/**
 * @description The terrain component
 * @class
 * @extends WebzComponent
 * @property {TerrainItem[]} terrainItems - The terrain items
 */
export class TerrainComponent extends WebzComponent {
    /**
     * @description The height of the terrain
     * @type {number}
     * @summary this is the number of pixels high the tallest terrain coudld be
     */
    private _terrainHeight: number;

    /**
     * @description The width of the terrain
     * @type {number}
     * @summary this is the number of pixels wide each terrain block is
     */
    private _width: number = Globals.TERRAIN_PART_WIDTH;

    /**
     * @description The terrain items
     * @type {TerrainItem[]}
     * @summary this is the array of terrain items
     */
    private _polys: TerrainItem[] = [];

    /**
     * @description The terrain items
     * @type {TerrainItem[]}
     * @summary this is the array of terrain item
     * @public
     */
    public get terrainItems(): TerrainItem[] {
        return this._polys;
    }

    /**
     * @description The constructor of the TerrainComponent
     * @param {number} terrainHeight - The height of the terrain
     * @summary Creates a terrain component
     * @summary Randomly allocates terrain block polygons
     * @memberof TerrainComponent
     * @constructor
     */
    constructor(terrainHeight: number = 100) {
        super(html, css);
        this._terrainHeight = terrainHeight;
        const numTerainBlocks =
            this.getWindowSize().windowWidth / this._width + 1;
        let oldPoint = getRandomInt(20, this._terrainHeight - 20);
        const rflat1 = getRandomInt(0, numTerainBlocks);
        const rflat2 = getRandomInt(0, numTerainBlocks);
        for (let i = 0; i < numTerainBlocks; i++) {
            if (i === rflat1 || i === rflat2) {
                const p = new TerrainItem(
                    i * this._width,
                    oldPoint,
                    (i + 1) * this._width,
                    oldPoint,
                    terrainHeight,
                );
                this._polys.push(p);
                this.addComponent(p, "terrain");
            } else {
                let newPoint = getRandomInt(20, this._terrainHeight - 20);
                const p = new TerrainItem(
                    i * this._width,
                    oldPoint,
                    (i + 1) * this._width,
                    newPoint,
                    terrainHeight,
                );
                this._polys.push(p);
                this.addComponent(p, "terrain");
                oldPoint = newPoint;
            }
        }
    }
}
