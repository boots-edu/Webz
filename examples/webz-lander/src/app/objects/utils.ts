/**
 * @description A position interface
 * @interface
 * @summary A 2D vector
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * @description Describes possible game states
 * @enum
 */
export enum GameStatus {
    Ok,
    Crash,
    Land,
    Orbit,
    Miss,
}
