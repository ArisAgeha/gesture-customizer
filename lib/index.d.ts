export declare type GestureHandler = () => void;
export interface GestureList {
    [key: string]: GestureHandlerItem[];
}
export declare type GestureHandlerItem = {
    gestureHandler: GestureHandler;
    gestureAction: GestureAction[];
};
export declare type KeyType = {
    mouseType: 'L' | 'R' | 'LR' | 'M';
    ctrlKey?: boolean;
    shiftKey?: boolean;
};
export declare type Direction = 'T' | 'TR' | 'R' | 'RB' | 'B' | 'BL' | 'L' | 'LT';
export interface GestureAction {
    direction: Direction;
    minDistance?: number;
    maxDistance?: number;
    maxSpendTime?: number;
}
export declare type MoveStep = {
    deltaX: number;
    deltaY: number;
    direction: Direction;
    spendTime: number;
};
declare class GestureFactory {
    gestureList: GestureList;
    isPause: boolean;
    MIN_DETECT_DISTANCE: number;
    constructor();
    registry(keyType: KeyType, gestureAction: GestureAction[], callback: GestureHandler): void;
    remove(keyType: KeyType, callback: GestureHandler): void;
    pause(): void;
    resume(): void;
    private initListener;
    private checkHandlerList;
    private checkShouldInvokeHandler;
    private getDirection;
    private saveGestureHandler;
    private getMouseTypeFromButtons;
    private getIdentifier;
}
export declare const Gesture: GestureFactory;
export {};
