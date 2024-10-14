export class tokenImage {

    image: HTMLImageElement;
    visible = false;
    x: number;
    y: number;
    percentX: number;
    percentY: number;
    width: number;
    height: number;
    ratio: number;

    constructor(percentX: number, percentY: number, ratio: number, image = new Image(), visible = false, x = 0, y = 0, width = 0, height = 0) {
        this.image = image;
        this.visible = visible;
        this.x = x;
        this.y = y;
        this.percentX = percentX;
        this.percentY = percentY;
        this.width = width;
        this.height = height;
        this.ratio = ratio
    }

    getVisibility() {
        return this.visible;
    }
    setVisibility(visibility: boolean) {
        this.visible = visibility;
    }
}