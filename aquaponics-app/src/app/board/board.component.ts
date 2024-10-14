import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tokenImage } from './tokenImage.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements AfterViewInit, OnInit {

  @ViewChild('boardcanvas', { static: false }) boardCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('interactivecanvas', { static: false }) interactiveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('boardcanvascontainers', { static: false }) container!: ElementRef<HTMLDivElement>;

  boardContext!: CanvasRenderingContext2D;
  interactiveContext!: CanvasRenderingContext2D;

  // Measurements of the screen available space
  containerWidth = 0;
  containerHeight = 0;

  // Measurements of the drawn board
  boardWidth = 0;
  boardHeight = 0;

  // Upper-left coordinates of the board image
  dx = 0;
  dy = 0;

  // Scale of the images
  adjustmentRatio = 1;

  boardImage = new Image();
  // Token images
  tokenImages: { [key: string]: tokenImage } = {
    seedling1Img: new tokenImage(0.135, 0.193, 0.67),
    seedling2Img: new tokenImage(0.135, (0.193 + 0.085), 0.67),
    seedling3Img: new tokenImage(0.135, (0.193 + 0.085 * 2), 0.67),
    plant1Img: new tokenImage(0.27, 0.193, 0.67),
    plant2Img: new tokenImage(0.27, (0.193 + 0.085), 0.67),
    plant3Img: new tokenImage(0.27, (0.193 + 0.085 * 2), 0.67),
    pumpImg: new tokenImage(0.029, 0.453, 0.67),
    biofilterImage: new tokenImage(0.029, 0.715, 0.67),
    alevin1Img: new tokenImage(0.15, 0.6, 0.55),
    alevin2Img: new tokenImage(0.264, 0.6, 0.55),
    fishImg: new tokenImage(0.205, 0.747, 0.55),
    disaster1Img: new tokenImage(0.531, 0.376, 0.684),
    disaster2Img: new tokenImage(0.62, 0.376, 0.684),
    disaster3Img: new tokenImage(0.709, 0.376, 0.684),
    disaster4Img: new tokenImage(0.797, 0.376, 0.684),
    disaster5Img: new tokenImage(0.885, 0.376, 0.684),
  };

  ngOnInit(): void {
    this.tokenImages['seedling1Img'].image.src = 'images/Plántula.png';
    this.tokenImages['seedling2Img'].image.src = 'images/Plántula.png';
    this.tokenImages['seedling3Img'].image.src = 'images/Plántula.png';
    this.tokenImages['plant1Img'].image.src = 'images/Planta.png';
    this.tokenImages['plant2Img'].image.src = 'images/Planta.png';
    this.tokenImages['plant3Img'].image.src = 'images/Planta.png';
    this.tokenImages['pumpImg'].image.src = 'images/Energía.png';
    this.tokenImages['biofilterImage'].image.src = 'images/Bacterias.png';
    this.tokenImages['alevin1Img'].image.src = 'images/Alevines.png';
    this.tokenImages['alevin2Img'].image.src = 'images/Alevines.png';
    this.tokenImages['fishImg'].image.src = 'images/Peces.png';
    this.tokenImages['disaster1Img'].image.src = 'images/Desastre - 1.png';
    this.tokenImages['disaster2Img'].image.src = 'images/Desastre - 2.png';
    this.tokenImages['disaster3Img'].image.src = 'images/Desastre - 3.png';
    this.tokenImages['disaster4Img'].image.src = 'images/Desastre - 4.png';
    this.tokenImages['disaster5Img'].image.src = 'images/Desastre - 4.png';
  }

  ngAfterViewInit(): void {
    this.boardContext = this.boardCanvas.nativeElement.getContext('2d')!;
    this.interactiveContext = this.interactiveCanvas.nativeElement.getContext('2d')!;

    // Update the canvas size variables
    this.drawContent();

    window.addEventListener('resize', () => {
      this.drawContent();
    });
  }

  onClick(click: MouseEvent) {
    var clickX = click.offsetX;
    var clickY = click.offsetY;

    Object.keys(this.tokenImages).forEach(key => {
      if (this.tokenImages[key].getVisibility() &&
        this.isInside(
          clickX,
          clickY,
          this.tokenImages[key].x,
          this.tokenImages[key].y,
          this.tokenImages[key].width,
          this.tokenImages[key].height
        )) {
        console.log(key);
        this.ereaseRect(this.tokenImages[key]);
        return;
      }
    })
  }

  onRightClick(click: Event) {
    click.preventDefault();
  }

  // Method to draw the canvas

  drawContent() {
    this.updateCanvasResolution();
    this.drawBoard();
  }

  drawInteractiveContent() {
    this.drawLifeCycle(1);
    this.drawSeedlings();
    this.drawPlants([true, false, true]);
    this.drawPump();
    this.drawBiofiler();
    this.drawAlevin([true, true]);
    this.drawFish();
    this.drawDisaster1();
    this.drawDisaster2();
    this.drawDisaster3();
    this.drawDisaster4();
  }

  updateCanvasResolution() {
    const boardCanvasRef = this.boardCanvas.nativeElement;
    const interactiveCanvasRef = this.interactiveCanvas.nativeElement;

    this.containerHeight = this.container.nativeElement.clientHeight;
    this.containerWidth = this.container.nativeElement.clientWidth;

    // Adjust the canvas size in CSS pixels (how it appears on the screen)

    boardCanvasRef.style.height = `${this.containerHeight}px`;
    boardCanvasRef.style.width = `${this.containerWidth}px`;

    interactiveCanvasRef.style.height = `${this.containerHeight}px`;
    interactiveCanvasRef.style.width = `${this.containerWidth}px`;

    // Update the canvas width and height attributes (resolution in drawing pixels)
    boardCanvasRef.height = this.containerHeight;
    boardCanvasRef.width = this.containerWidth;

    interactiveCanvasRef.height = this.containerHeight;
    interactiveCanvasRef.width = this.containerWidth;
  }

  drawBoard(): void {
    this.boardImage.src = 'images/Tablero completo.png';
    this.boardImage.onload = () => {
      // Original image dimensions
      const imgWidth = this.boardImage.width;
      const imgHeight = this.boardImage.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = this.containerWidth / this.containerHeight;

      // Checks if the image shall adjust its width or height to fit without 
      if (canvasRatio < imgRatio) {
        this.adjustmentRatio = this.containerWidth / imgWidth;
        this.dy = (this.containerHeight - (imgHeight * this.adjustmentRatio)) / 2
      } else {
        this.adjustmentRatio = this.containerHeight / imgHeight;
        this.dx = (this.containerWidth - (imgWidth * this.adjustmentRatio))
      }

      this.boardWidth = imgWidth * this.adjustmentRatio;
      this.boardHeight = imgHeight * this.adjustmentRatio;

      this.boardContext.drawImage(this.boardImage, this.dx, this.dy, this.boardWidth, this.boardHeight);
      this.roundedRect(this.boardContext,
        this.dx + (this.boardWidth * 0.527),
        this.dy + (this.boardHeight * 0.854),
        this.boardWidth * 0.072,
        this.boardHeight * 0.068,
        this.boardWidth * 0.01);

      this.drawInteractiveContent();
    }
  }

  // Draw the indicator of the remaining uses of the hydroponics and fish tank
  drawLifeCycle(damage: number) {
    const newImageWidth = 79.1 * this.adjustmentRatio;
    const newImageHeigth = 26.6 * this.adjustmentRatio;

    for (let i = 0; i < 3; i++) {
      this.lifeCycleToken(
        this.interactiveContext,
        this.dx + (this.boardWidth * (0.258 + 0.068 * i)),
        this.dy + (this.boardHeight * 0.135),
        newImageWidth,
        newImageHeigth,
        damage > (2 - i)
      );

      if (i != 2) {
        this.lifeCycleToken(
          this.interactiveContext,
          this.dx + (this.boardWidth * (0.302 + 0.068 * i)),
          this.dy + (this.boardHeight * 0.9),
          newImageWidth,
          newImageHeigth,
          damage > (1 - i)
        );
      }
    }
  }

  drawSeedlings(): void {
    this.drawImage(
      this.tokenImages['seedling1Img'],
      this.dx + (this.boardWidth * this.tokenImages['seedling1Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['seedling1Img'].percentY),
      this.adjustmentRatio * this.tokenImages['seedling1Img'].ratio
    );

    this.drawImage(
      this.tokenImages['seedling2Img'],
      this.dx + (this.boardWidth * this.tokenImages['seedling2Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['seedling2Img'].percentY),
      this.adjustmentRatio * this.tokenImages['seedling2Img'].ratio
    );

    this.drawImage(
      this.tokenImages['seedling3Img'],
      this.dx + (this.boardWidth * this.tokenImages['seedling3Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['seedling3Img'].percentY),
      this.adjustmentRatio * this.tokenImages['seedling3Img'].ratio
    );
  }

  drawPlants(grownPlants: Array<boolean>): void {
    if (grownPlants[0]) {
      this.drawImage(
        this.tokenImages['plant1Img'],
        this.dx + (this.boardWidth * this.tokenImages['plant1Img'].percentX),
        this.dy + (this.boardHeight * this.tokenImages['plant1Img'].percentY),
        this.adjustmentRatio * this.tokenImages['plant1Img'].ratio
      );
    }
    if (grownPlants[1]) {
      this.drawImage(
        this.tokenImages['plant2Img'],
        this.dx + (this.boardWidth * this.tokenImages['plant2Img'].percentX),
        this.dy + (this.boardHeight * this.tokenImages['plant2Img'].percentY),
        this.adjustmentRatio * this.tokenImages['plant2Img'].ratio
      );
    }

    this.drawImage(
      this.tokenImages['plant3Img'],
      this.dx + (this.boardWidth * this.tokenImages['plant3Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['plant3Img'].percentY),
      this.adjustmentRatio * this.tokenImages['plant3Img'].ratio
    );
  }

  drawPump(): void {
    this.drawImage(
      this.tokenImages['pumpImg'],
      this.dx + (this.boardWidth * this.tokenImages['pumpImg'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['pumpImg'].percentY),
      this.adjustmentRatio * this.tokenImages['pumpImg'].ratio
    );
  }

  drawBiofiler(): void {
    this.drawImage(
      this.tokenImages['biofilterImage'],
      this.dx + (this.boardWidth * this.tokenImages['biofilterImage'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['biofilterImage'].percentY),
      this.adjustmentRatio * this.tokenImages['biofilterImage'].ratio
    );
  }

  drawAlevin(alevinStages: Array<boolean>): void {
    if (alevinStages[0]) {
      this.drawImage(
        this.tokenImages['alevin1Img'],
        this.dx + (this.boardWidth * this.tokenImages['alevin1Img'].percentX),
        this.dy + (this.boardHeight * this.tokenImages['alevin1Img'].percentY),
        this.adjustmentRatio * this.tokenImages['alevin1Img'].ratio
      );
    }

    if (alevinStages[1]) {
      this.drawImage(
        this.tokenImages['alevin2Img'],
        this.dx + (this.boardWidth * this.tokenImages['alevin2Img'].percentX),
        this.dy + (this.boardHeight * this.tokenImages['alevin2Img'].percentY),
        this.adjustmentRatio * this.tokenImages['alevin2Img'].ratio
      );
    }
  }

  drawFish(): void {
    this.drawImage(
      this.tokenImages['fishImg'],
      this.dx + (this.boardWidth * this.tokenImages['fishImg'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['fishImg'].percentY),
      this.adjustmentRatio * this.tokenImages['fishImg'].ratio
    );
  }

  drawDisaster1(): void {
    this.drawImage(
      this.tokenImages['disaster1Img'],
      this.dx + (this.boardWidth * this.tokenImages['disaster1Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['disaster1Img'].percentY),
      this.adjustmentRatio * this.tokenImages['disaster1Img'].ratio
    );
  }

  drawDisaster2(): void {
    this.drawImage(
      this.tokenImages['disaster2Img'],
      this.dx + (this.boardWidth * this.tokenImages['disaster2Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['disaster2Img'].percentY),
      this.adjustmentRatio * this.tokenImages['disaster2Img'].ratio
    );
  }

  drawDisaster3(): void {
    this.drawImage(
      this.tokenImages['disaster3Img'],
      this.dx + (this.boardWidth * this.tokenImages['disaster3Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['disaster3Img'].percentY),
      this.adjustmentRatio * this.tokenImages['disaster3Img'].ratio
    );
  }

  drawDisaster4(): void {
    this.drawImage(
      this.tokenImages['disaster4Img'],
      this.dx + (this.boardWidth * this.tokenImages['disaster4Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['disaster4Img'].percentY),
      this.adjustmentRatio * this.tokenImages['disaster4Img'].ratio
    );
    this.drawImage(
      this.tokenImages['disaster5Img'],
      this.dx + (this.boardWidth * this.tokenImages['disaster5Img'].percentX),
      this.dy + (this.boardHeight * this.tokenImages['disaster5Img'].percentY),
      this.adjustmentRatio * this.tokenImages['disaster5Img'].ratio
    );
  }

  // Method taken from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
  // Any copyright is dedicated to the Public Domain: https://creativecommons.org/publicdomain/zero/1.0/
  roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fillStyle = '#e0e9ca';
    ctx.fill();
  }

  lifeCycleToken(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, damage: boolean) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width * 0.75, y);
    ctx.lineTo(x + width, y + height * 0.5);
    ctx.lineTo(x + width * 0.8, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width * 0.2, y + height * 0.5);
    ctx.lineTo(x, y);
    if (damage) {
      ctx.fillStyle = '#d05c34';
    } else {
      ctx.fillStyle = '#94cf4f';
    }
    ctx.fill();
  }

  drawImage(img: tokenImage, x: number, y: number, ratio: number): void {
    // Original image dimensions
    img.width = img.image.width * ratio;
    img.height = img.image.height * ratio;

    img.x = x;
    img.y = y;

    this.interactiveContext.drawImage(
      img.image,
      x,
      y,
      img.width,
      img.height);
    img.setVisibility(true);
  }

  ereaseRect(img: tokenImage): void {
    // Original image dimensions
    this.interactiveContext.clearRect(img.x - 1, img.y - 1, img.width + 1, img.height + 1);
    img.setVisibility(false);
  }

  isInside(mouseX: number, mouseY: number, upperX: number, upperY: number, width: number, height: number) {
    return (mouseX >= upperX && mouseX <= (upperX + width) && mouseY >= upperY && mouseY <= (upperY + height));
  }
}
