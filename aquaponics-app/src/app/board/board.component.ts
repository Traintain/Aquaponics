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

  containerWidth = 0;
  containerHeight = 0;

  boardImage = new Image();

  ngAfterViewInit(): void {
    this.boardContext = this.boardCanvas.nativeElement.getContext('2d')!;
    this.interactiveContext = this.interactiveCanvas.nativeElement.getContext('2d')!;

    // Update the canvas size variables
    this.updateCanvasResolution();

    this.drawBoard();

    window.addEventListener('resize', () => {
      this.updateCanvasResolution();
      this.drawBoard();
    });
  }

  updateCanvasResolution() {
    const boardCanvasRef = this.boardCanvas.nativeElement;

    this.containerHeight = this.container.nativeElement.clientHeight;
    this.containerWidth = this.container.nativeElement.clientWidth;

    // Adjust the canvas size in CSS pixels (how it appears on the screen)

    boardCanvasRef.style.height = `${this.containerHeight}px`;
    boardCanvasRef.style.width = `${this.containerWidth}px`;

    // Update the canvas width and height attributes (resolution in drawing pixels)
    boardCanvasRef.height = this.containerHeight;
    boardCanvasRef.width = this.containerWidth;
  }

  drawBoard(): void {
    const boardCtx = this.boardContext;

    this.boardImage.src = 'images/Tablero completo.png';
    this.boardImage.onload = () => {
      // Original image dimensions
      const imgWidth = this.boardImage.width;
      const imgHeight = this.boardImage.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = this.containerWidth / this.containerHeight;

      var adjustmentRatio = 1;
      var dx = 0;
      var dy = 0;
      if (canvasRatio < imgRatio) {
        adjustmentRatio = this.containerWidth / imgWidth;
        dy = (this.containerHeight - (imgHeight * adjustmentRatio)) / 2
      } else {
        adjustmentRatio = this.containerHeight / imgHeight;
        dx = (this.containerWidth - (imgWidth * adjustmentRatio))
      }

      var newImageWidth = imgWidth * adjustmentRatio;
      var newImageHeigth = imgHeight * adjustmentRatio;
      boardCtx.drawImage(this.boardImage, dx, dy, newImageWidth, newImageHeigth);
      this.roundedRect(boardCtx,
        dx + (newImageWidth * 0.527),
        dy + (newImageHeigth * 0.854),
        newImageWidth * 0.072,
        newImageHeigth * 0.068,
        newImageWidth * 0.01);
    }
  }

  // Méthod taken from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
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
}
