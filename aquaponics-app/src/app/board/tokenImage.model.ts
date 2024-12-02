export class tokenImage {

    image: HTMLImageElement;
    visible = false;
    clickable = false;
    x: number;
    y: number;
    percentX: number;
    percentY: number;
    width: number;
    height: number;
    ratio: number;
    onClick: () => void;

    constructor(percentX: number, percentY: number, ratio: number, image = new Image(), visible = false, clickable = false, x = 0, y = 0, width = 0, height = 0, onClick = () => { }) {
        this.image = image;
        this.visible = visible;
        this.clickable = clickable;
        this.x = x;
        this.y = y;
        this.percentX = percentX;
        this.percentY = percentY;
        this.width = width;
        this.height = height;
        this.ratio = ratio;
        this.onClick = onClick;
    }

    getVisibility() {
        return this.visible;
    }

    setVisibility(visibility: boolean) {
        this.visible = visibility;
    }

    getClickability() {
        return this.clickable;
    }

    setClickability(clickability: boolean) {
        this.clickable = clickability;
    }
}

export class highlightBox {
    visible = false;
    clickable = false;
    x: number;
    y: number;
    percentX: number;
    percentY: number;
    width: number;
    height: number;
    percentWidth: number;
    percentHeight: number;
    fillColor: string;
    radius: number;
    onClick: () => void;

    constructor(percentX: number, percentY: number, percentWidth: number, percentHeight: number, fillColor: string, radius: number, visible = false, clickable = false, x = 0, y = 0, width = 0, height = 0, onClick = () => { }) {
        this.visible = visible;
        this.clickable = clickable;
        this.x = x;
        this.y = y;
        this.percentX = percentX;
        this.percentY = percentY;
        this.width = width;
        this.height = height;
        this.percentWidth = percentWidth;
        this.percentHeight = percentHeight;
        this.fillColor = fillColor;
        this.radius = radius;
        this.onClick = onClick;
    }

    getVisibility() {
        return this.visible;
    }

    setVisibility(visibility: boolean) {
        this.visible = visibility;
    }

    getClickability() {
        return this.clickable;
    }

    setClickability(clickability: boolean) {
        this.clickable = clickability;
    }
}