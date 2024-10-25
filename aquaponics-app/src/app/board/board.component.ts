import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tokenImage } from './tokenImage.model';
import { GameSatateService } from '../game-state/game-satate.service';

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
    seedling1Img: new tokenImage(0.135, 0.193, 0.67, "#000000ff", 0),
    seedling2Img: new tokenImage(0.135, (0.193 + 0.085), 0.67, "#000000ff", 0),
    seedling3Img: new tokenImage(0.135, (0.193 + 0.085 * 2), 0.67, "#000000ff", 0),
    plant1Img: new tokenImage(0.27, 0.193, 0.67, "#000000ff", 0),
    plant2Img: new tokenImage(0.27, (0.193 + 0.085), 0.67, "#000000ff", 0),
    plant3Img: new tokenImage(0.27, (0.193 + 0.085 * 2), 0.67, "#000000ff", 0),
    pumpImg: new tokenImage(0.029, 0.453, 0.67, "#000000ff", 0),
    biofilterImage: new tokenImage(0.029, 0.715, 0.67, "#000000ff", 0),
    alevin1Img: new tokenImage(0.15, 0.6, 0.55, "#000000ff", 0),
    alevin2Img: new tokenImage(0.264, 0.6, 0.55, "#000000ff", 0),
    alevin3Img: new tokenImage(0.205, 0.747, 0.55, "#000000ff", 0),
    disaster1Img: new tokenImage(0.531, 0.376, 0.684, "#000000ff", 0),
    disaster2Img: new tokenImage(0.62, 0.376, 0.684, "#000000ff", 0),
    disaster3Img: new tokenImage(0.709, 0.376, 0.684, "#000000ff", 0),
    disaster4Img: new tokenImage(0.797, 0.376, 0.684, "#000000ff", 0),
    disaster5Img: new tokenImage(0.885, 0.376, 0.684, "#000000ff", 0),
    moneyBox: new tokenImage(0.753, 0.122, 0, "#ffffff99", 18),
  };

  // State variables
  currentRound = 0;
  currentStep = 0;
  currentMoney = 0;
  currentDamage = 0;
  isBiofilter = false;
  isPump = false;

  plantedSeeds = [false, false, false];
  grownPlants = [false, false, false];
  fishesInTank = [false, false, false];

  constructor(private gameStateService: GameSatateService) {
    for (let i = 1; i <= 3; i++) {
      this.tokenImages[`seedling${i}Img`].image.src = 'images/Plántula.png';
      this.tokenImages[`seedling${i}Img`].onClick = () => {
        this.tokenImages[`seedling${i}Img`].setClickability(false);
        this.plantedSeeds[i - 1] = true;
        this.ereaseRect(this.tokenImages[`seedling${i}Img`].x, this.tokenImages[`seedling${i}Img`].y, this.tokenImages[`seedling${i}Img`].width, this.tokenImages[`seedling${i}Img`].height, this.tokenImages[`seedling${i}Img`]);
        this.drawSeedlings();
      }
      this.tokenImages[`plant${i}Img`].image.src = 'images/Planta.png';
    }

    this.tokenImages['pumpImg'].image.src = 'images/Energía.png';
    this.tokenImages['biofilterImage'].image.src = 'images/Bacterias.png';
    this.tokenImages['alevin1Img'].image.src = 'images/Alevines.png';
    this.tokenImages['alevin2Img'].image.src = 'images/Alevines.png';
    this.tokenImages['alevin3Img'].image.src = 'images/Peces.png';
    this.tokenImages['disaster1Img'].image.src = 'images/Desastre - 1.png';
    this.tokenImages['disaster2Img'].image.src = 'images/Desastre - 2.png';
    this.tokenImages['disaster3Img'].image.src = 'images/Desastre - 3.png';
    this.tokenImages['disaster4Img'].image.src = 'images/Desastre - 4.png';
    this.tokenImages['disaster5Img'].image.src = 'images/Desastre - 4.png';

    this.tokenImages['moneyBox'].onClick = () => {
      this.gameStateService.updateMoney(this.currentMoney + this.gameStateService.roundParams[this.currentRound].money);
      this.gameStateService.updateStep(2);
      this.ereaseRect(this.tokenImages['moneyBox'].x, this.tokenImages['moneyBox'].y, this.tokenImages['moneyBox'].width, this.tokenImages['moneyBox'].height, this.tokenImages['moneyBox']);
      this.drawMoney();
      this.drawSeedlings();
    }
  }

  ngOnInit(): void {
    this.gameStateService.currentRound$.subscribe((newRound) => {
      this.currentRound = newRound;
    })

    this.gameStateService.currentStep$.subscribe((newStep) => {
      this.currentStep = newStep;
    })

    this.gameStateService.currentMoney$.subscribe((newMoney) => {
      this.currentMoney = newMoney;
    })

    this.gameStateService.currentDamage$.subscribe((newDamage) => {
      this.currentDamage = newDamage;
    })

    this.gameStateService.isBiofilter$.subscribe((newBiofilter) => {
      this.isBiofilter = newBiofilter;
    })

    this.gameStateService.isPump$.subscribe((newPump) => {
      this.isPump = newPump;
    })
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

    Object.keys(this.tokenImages).some(key => {
      if (this.tokenImages[key].getClickability() &&
        this.isInside(
          clickX,
          clickY,
          this.tokenImages[key].x,
          this.tokenImages[key].y,
          this.tokenImages[key].width,
          this.tokenImages[key].height
        )) {
        this.tokenImages[key].onClick();
        return true;
      } else {
        return false;
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
    this.drawMoney();
    this.drawLifeCycle(this.currentDamage);
    this.drawSeedlings();
    this.drawPlants();
    this.drawPump();
    this.drawBiofiler();
    this.drawFishTank();
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
        this.boardWidth * 0.01,
        '#e0e9ca');

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
    for (let i = 1; i <= 3; i++) {
      if (this.plantedSeeds[i - 1]) {
        this.drawImage(
          this.tokenImages[`seedling${i}Img`]
        );
      } else if (this.currentStep == 2) {
        this.setTokenImageSize(this.tokenImages[`seedling${i}Img`]);
        this.tokenImages[`seedling${i}Img`].setClickability(true);
        this.roundedRect(
          this.interactiveContext,
          this.tokenImages[`seedling${i}Img`].x,
          this.tokenImages[`seedling${i}Img`].y,
          this.tokenImages[`seedling${i}Img`].width,
          this.tokenImages[`seedling${i}Img`].height,
          this.adjustmentRatio * this.tokenImages[`seedling${i}Img`].radius,
          this.tokenImages[`seedling${i}Img`].fillColor
        )
      }
    }
  }

  drawPlants(): void {
    for (let i = 1; i <= 3; i++) {
      if (this.grownPlants[i - 1]) {
        this.drawImage(
          this.tokenImages[`plant${i}Img`]
        );
      }
    }
  }

  drawPump(): void {
    this.drawImage(
      this.tokenImages['pumpImg']
    );
  }

  drawBiofiler(): void {
    this.drawImage(
      this.tokenImages['biofilterImage']
    );
  }

  drawFishTank(): void {
    for (let i = 1; i <= 3; i++) {
      if (this.fishesInTank[i - 1]) {
        this.drawImage(
          this.tokenImages[`alevin${i}Img`]
        );
      }
    }
  }

  drawDisaster1(): void {
    this.drawImage(
      this.tokenImages['disaster1Img']
    );
  }

  drawDisaster2(): void {
    this.drawImage(
      this.tokenImages['disaster2Img']
    );
  }

  drawDisaster3(): void {
    this.drawImage(
      this.tokenImages['disaster3Img']
    );
  }

  drawDisaster4(): void {
    this.drawImage(
      this.tokenImages['disaster4Img']
    );
    this.drawImage(
      this.tokenImages['disaster5Img']
    );
  }

  drawMoney() {
    this.interactiveContext.font = `${this.boardWidth * 0.04}px source-sans-pro,sans-serif`;
    this.interactiveContext.fillStyle = '#000'
    this.interactiveContext.fillText(
      `$ ${this.currentMoney}`,
      this.dx + (this.boardWidth * 0.91),
      this.dy + (this.boardHeight * 0.214)
    )

    this.tokenImages['moneyBox'].setVisibility(this.currentStep == 1);
    this.tokenImages['moneyBox'].setClickability(this.currentStep == 1);
    this.tokenImages['moneyBox'].x = this.dx + (this.boardWidth * this.tokenImages['moneyBox'].percentX);
    this.tokenImages['moneyBox'].y = this.dy + (this.boardHeight * this.tokenImages['moneyBox'].percentY);
    this.tokenImages['moneyBox'].width = this.boardWidth * 0.235;
    this.tokenImages['moneyBox'].height = this.boardHeight * 0.18;
    if (this.tokenImages['moneyBox'].getVisibility()) {
      this.roundedRect(
        this.interactiveContext,
        this.tokenImages['moneyBox'].x,
        this.tokenImages['moneyBox'].y,
        this.tokenImages['moneyBox'].width,
        this.tokenImages['moneyBox'].height,
        this.adjustmentRatio * this.tokenImages['moneyBox'].radius,
        this.tokenImages['moneyBox'].fillColor
      )
    }
  }

  // Method taken from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
  // Any copyright is dedicated to the Public Domain: https://creativecommons.org/publicdomain/zero/1.0/
  roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillStyle: string) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fillStyle = fillStyle;
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

  setTokenImageSize(img: tokenImage): void {
    // Original image dimensions
    img.width = img.image.width * this.adjustmentRatio * img.ratio;
    img.height = img.image.height * this.adjustmentRatio * img.ratio;

    img.x = this.dx + (this.boardWidth * img.percentX);
    img.y = this.dy + (this.boardHeight * img.percentY);
  }

  drawImage(img: tokenImage): void {
    this.setTokenImageSize(img);

    this.interactiveContext.drawImage(
      img.image,
      img.x,
      img.y,
      img.width,
      img.height);
  }

  ereaseRect(x: number, y: number, width: number, height: number, img?: tokenImage): void {
    // Original image dimensions
    this.interactiveContext.clearRect(x - 1, y - 1, width + 1, height + 1);
  }

  isInside(mouseX: number, mouseY: number, upperX: number, upperY: number, width: number, height: number) {
    return (mouseX >= upperX && mouseX <= (upperX + width) && mouseY >= upperY && mouseY <= (upperY + height));
  }
}
