import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements AfterViewInit {

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
  seedlingImg = new Image();
  plantImg = new Image();
  pumpImg = new Image();
  biofilterImg = new Image();
  alevinImg = new Image();
  fishImg = new Image();
  disaster1Img = new Image();
  disaster2Img = new Image();
  disaster3Img = new Image();
  disaster4Img = new Image();
  disaster5Img = new Image();

  ngAfterViewInit(): void {
    this.boardContext = this.boardCanvas.nativeElement.getContext('2d')!;
    this.interactiveContext = this.interactiveCanvas.nativeElement.getContext('2d')!;

    // Update the canvas size variables
    this.drawContent();

    window.addEventListener('resize', () => {
      this.drawContent();
    });
  }

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
    this.seedlingImg.src = 'images/Plántula.png';
    this.seedlingImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.seedlingImg.width * (this.adjustmentRatio * 0.67);
      const imgHeight = this.seedlingImg.height * (this.adjustmentRatio * 0.67);

      for (let i = 0; i < 3; i++) {
        this.interactiveContext.drawImage(
          this.seedlingImg,
          this.dx + (this.boardWidth * 0.135),
          this.dy + (this.boardHeight * 0.193 + (i * (this.boardHeight * 0.085))),
          imgWidth,
          imgHeight);
      }
    }
  }

  drawPlants(grownPlants: Array<boolean>): void {
    this.plantImg.src = 'images/Planta.png';
    this.plantImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.plantImg.width * (this.adjustmentRatio * 0.67);
      const imgHeight = this.plantImg.height * (this.adjustmentRatio * 0.67);

      for (let i = 0; i < 3; i++) {
        if (grownPlants[i]) {
          this.interactiveContext.drawImage(
            this.plantImg,
            this.dx + (this.boardWidth * 0.135 + (this.boardHeight * 0.18)),
            this.dy + (this.boardHeight * 0.193 + (i * (this.boardHeight * 0.085))),
            imgWidth,
            imgHeight);
        }
      }
    }
  }

  drawPump(): void {
    this.pumpImg.src = 'images/Energía.png';
    this.pumpImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.pumpImg.width * (this.adjustmentRatio * 0.67);
      const imgHeight = this.pumpImg.height * (this.adjustmentRatio * 0.67);

      this.interactiveContext.drawImage(
        this.pumpImg,
        this.dx + (this.boardWidth * 0.029),
        this.dy + (this.boardHeight * 0.453),
        imgWidth,
        imgHeight);
    }
  }

  drawBiofiler(): void {
    this.biofilterImg.src = 'images/Bacterias.png';
    this.biofilterImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.biofilterImg.width * (this.adjustmentRatio * 0.67);
      const imgHeight = this.biofilterImg.height * (this.adjustmentRatio * 0.67);

      this.interactiveContext.drawImage(
        this.biofilterImg,
        this.dx + (this.boardWidth * 0.029),
        this.dy + (this.boardHeight * 0.715),
        imgWidth,
        imgHeight);
    }
  }

  drawAlevin(alevinStages: Array<boolean>): void {
    this.alevinImg.src = 'images/Alevines.png';
    this.alevinImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.alevinImg.width * (this.adjustmentRatio * 0.55);
      const imgHeight = this.alevinImg.height * (this.adjustmentRatio * 0.55);

      for (let i = 0; i < 2; i++) {
        if (alevinStages[i]) {
          this.interactiveContext.drawImage(
            this.alevinImg,
            this.dx + (this.boardWidth * 0.15 + (this.boardHeight * 0.153 * i)),
            this.dy + (this.boardHeight * 0.6),
            imgWidth,
            imgHeight);
        }
      }
    }
  }

  drawFish(): void {
    this.fishImg.src = 'images/Peces.png';
    this.fishImg.onload = () => {
      // Original image dimensions
      const imgWidth = this.fishImg.width * (this.adjustmentRatio * 0.55);
      const imgHeight = this.fishImg.height * (this.adjustmentRatio * 0.55);

      this.interactiveContext.drawImage(
        this.fishImg,
        this.dx + (this.boardWidth * 0.205),
        this.dy + (this.boardHeight * 0.747),
        imgWidth,
        imgHeight);
    }
  }

  drawDisaster1(): void {
    this.disaster1Img.src = 'images/Desastre - 1.png';
    this.disaster1Img.onload = () => {
      // Original image dimensions
      const imgWidth = this.disaster1Img.width * (this.adjustmentRatio * 0.684);
      const imgHeight = this.disaster1Img.height * (this.adjustmentRatio * 0.681);

      this.interactiveContext.drawImage(
        this.disaster1Img,
        this.dx + (this.boardWidth * 0.531),
        this.dy + (this.boardHeight * 0.376),
        imgWidth,
        imgHeight);
    }
  }

  drawDisaster2(): void {
    this.disaster2Img.src = 'images/Desastre - 2.png';
    this.disaster2Img.onload = () => {
      // Original image dimensions
      const imgWidth = this.disaster2Img.width * (this.adjustmentRatio * 0.684);
      const imgHeight = this.disaster2Img.height * (this.adjustmentRatio * 0.681);

      this.interactiveContext.drawImage(
        this.disaster2Img,
        this.dx + (this.boardWidth * 0.62),
        this.dy + (this.boardHeight * 0.376),
        imgWidth,
        imgHeight);
    }
  }

  drawDisaster3(): void {
    this.disaster3Img.src = 'images/Desastre - 3.png';
    this.disaster3Img.onload = () => {
      // Original image dimensions
      const imgWidth = this.disaster3Img.width * (this.adjustmentRatio * 0.684);
      const imgHeight = this.disaster3Img.height * (this.adjustmentRatio * 0.681);

      this.interactiveContext.drawImage(
        this.disaster3Img,
        this.dx + (this.boardWidth * 0.709),
        this.dy + (this.boardHeight * 0.376),
        imgWidth,
        imgHeight);
    }
  }

  drawDisaster4(): void {
    this.disaster4Img.src = 'images/Desastre - 4.png';
    this.disaster4Img.onload = () => {
      // Original image dimensions
      const imgWidth = this.disaster4Img.width * (this.adjustmentRatio * 0.684);
      const imgHeight = this.disaster4Img.height * (this.adjustmentRatio * 0.681);

      this.interactiveContext.drawImage(
        this.disaster4Img,
        this.dx + (this.boardWidth * 0.797),
        this.dy + (this.boardHeight * 0.376),
        imgWidth,
        imgHeight);

      this.interactiveContext.drawImage(
        this.disaster4Img,
        this.dx + (this.boardWidth * 0.885),
        this.dy + (this.boardHeight * 0.376),
        imgWidth,
        imgHeight);
    }
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
}
