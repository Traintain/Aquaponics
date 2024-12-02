import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { highlightBox, tokenImage } from './tokenImage.model';
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

  // Fill colors
  moneyColor = "#ead32e99";
  whiteTranslucent = "#00000099";
  disabledColor = "#00000099";

  // Token images and highlight boxes
  tokenImages: { [key: string]: tokenImage } = {
    seedling1Img: new tokenImage(0.135, 0.193, 0.67),
    seedling2Img: new tokenImage(0.135, (0.193 + 0.085), 0.67),
    seedling3Img: new tokenImage(0.135, (0.193 + 0.085 * 2), 0.67),
    plant1Img: new tokenImage(0.27, 0.193, 0.67),
    plant2Img: new tokenImage(0.27, (0.193 + 0.085), 0.67),
    plant3Img: new tokenImage(0.27, (0.193 + 0.085 * 2), 0.67),
    pumpImg: new tokenImage(0.029, 0.453, 0.67),
    biofilterImg: new tokenImage(0.029, 0.715, 0.67),
    alevin1Img: new tokenImage(0.15, 0.6, 0.55),
    alevin2Img: new tokenImage(0.264, 0.6, 0.55),
    alevin3Img: new tokenImage(0.205, 0.747, 0.55),
    disaster1Img: new tokenImage(0.531, 0.376, 0.684),
    disaster2Img: new tokenImage(0.62, 0.376, 0.684),
    disaster3Img: new tokenImage(0.709, 0.376, 0.684),
    disaster4Img: new tokenImage(0.797, 0.376, 0.684),
    disaster5Img: new tokenImage(0.885, 0.376, 0.684),
  };

  highlightBoxes: { [key: string]: highlightBox } = {
    moneyBox: new highlightBox(0.7525, 0.1205, 0.2355, 0.182, this.whiteTranslucent, 19),
    seedling1Box: new highlightBox(0.135, 0.193, 0.136, 0.065, this.moneyColor, 4),
    seedling2Box: new highlightBox(0.135, (0.193 + 0.085), 0.136, 0.065, this.moneyColor, 0),
    seedling3Box: new highlightBox(0.135, (0.193 + 0.085 * 2), 0.136, 0.065, this.moneyColor, 0),
    plant1Box: new highlightBox(0.27, 0.193, 0.1, 0.1, this.whiteTranslucent, 0),
    plant2Box: new highlightBox(0.27, (0.193 + 0.085), 0.1, 0.1, this.whiteTranslucent, 0),
    plant3Box: new highlightBox(0.27, (0.193 + 0.085 * 2), 0.1, 0.1, this.whiteTranslucent, 0),
    pumpBox: new highlightBox(0.0115, 0.379, 0.114, 0.202, this.moneyColor, 10),
    biofilterBox: new highlightBox(0.0115, 0.6515, 0.105, 0.15, this.moneyColor, 10),
    alevin1Box: new highlightBox(0.15, 0.6, 0.089, 0.1037, this.moneyColor, 10),
    alevin3Box: new highlightBox(0.205, 0.747, 0.1, 0.1, this.moneyColor, 10),
  }

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
    for (let i = 1; i <= 5; i++) {
      if (i <= 3) {
        this.tokenImages[`seedling${i}Img`].image.src = 'images/Plántula.png';
        this.highlightBoxes[`seedling${i}Box`].onClick = () => {
          if (this.currentMoney > 0 && this.currentDamage < 3) {
            this.gameStateService.updateMoney(this.currentMoney - 1);
            this.highlightBoxes[`seedling${i}Box`].setClickability(false);
            this.highlightBoxes[`seedling${i}Box`].setVisibility(false);
            this.tokenImages[`seedling${i}Img`].setVisibility(true);
            this.plantedSeeds[i - 1] = true;
            this.gameStateService.updatePlantedSeeds(this.plantedSeeds);
            this.drawInteractiveContent();
          }
        }
        this.tokenImages[`plant${i}Img`].image.src = 'images/Planta.png';
      }

      this.tokenImages[`disaster${i}Img`].image.src = `images/Desastre - ${i <= 4 ? i : 4}.png`;
    }

    this.tokenImages['pumpImg'].image.src = 'images/Energía.png';
    this.tokenImages['biofilterImg'].image.src = 'images/Bacterias.png';
    this.tokenImages['alevin1Img'].image.src = 'images/Alevines.png';
    this.highlightBoxes['alevin1Box'].onClick = () => {
      if (this.currentMoney > 0 && this.currentDamage < 2) {
        this.gameStateService.updateMoney(this.currentMoney - 1);
        this.highlightBoxes['alevin1Box'].setClickability(false);
        this.highlightBoxes['alevin1Box'].setVisibility(false);
        this.fishesInTank[0] = true;
        this.gameStateService.updateFishInTank(this.fishesInTank);
        this.drawInteractiveContent();
      }
    }
    this.tokenImages['alevin2Img'].image.src = 'images/Alevines.png';
    this.tokenImages['alevin3Img'].image.src = 'images/Peces.png';

    this.highlightBoxes['moneyBox'].onClick = () => {
      this.gameStateService.updateMoney(this.currentMoney + this.gameStateService.roundParams[this.currentRound].money);
      this.gameStateService.updateStep(2);
      this.ereaseRect(
        this.highlightBoxes['moneyBox'].x,
        this.highlightBoxes['moneyBox'].y,
        this.highlightBoxes['moneyBox'].width,
        this.highlightBoxes['moneyBox'].height);
      this.drawInteractiveContent();
    }

    this.highlightBoxes['pumpBox'].onClick = () => {
      if (this.currentMoney > 0) {
        this.gameStateService.updateMoney(this.currentMoney - 1);
        this.highlightBoxes['pumpBox'].setClickability(false);
        this.highlightBoxes['pumpBox'].setVisibility(false);
        this.tokenImages['pumpImg'].setVisibility(true);
        this.gameStateService.updatePump(true);
        this.drawInteractiveContent();
      }
    }

    this.highlightBoxes['biofilterBox'].onClick = () => {
      if (this.currentMoney > 0) {
        this.gameStateService.updateMoney(this.currentMoney - 1);
        this.highlightBoxes['biofilterBox'].setClickability(false);
        this.highlightBoxes['biofilterBox'].setVisibility(false);
        this.tokenImages['biofilterImg'].setVisibility(true);
        this.gameStateService.updateBiofilter(true);
        this.drawInteractiveContent();
      }
    }
  }

  ngOnInit(): void {
    this.gameStateService.currentRound$.subscribe((newRound) => {
      this.currentRound = newRound;
    })

    this.gameStateService.currentStep$.subscribe((newStep) => {
      this.currentStep = newStep;
      this.drawInteractiveContent();
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

    this.gameStateService.currentPlantedSeeds$.subscribe((currentSeeds) => {
      this.plantedSeeds = currentSeeds;
    })

    this.gameStateService.currentGrownPlants$.subscribe((currentPlants) => {
      this.grownPlants = currentPlants;
    })

    this.gameStateService.currentFishesInTank$.subscribe((currentFishes) => {
      this.fishesInTank = currentFishes;
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

    Object.keys(this.highlightBoxes).some(key => {
      if (this.highlightBoxes[key].getClickability() &&
        this.isInside(
          clickX,
          clickY,
          this.highlightBoxes[key].x,
          this.highlightBoxes[key].y,
          this.highlightBoxes[key].width,
          this.highlightBoxes[key].height
        )) {
        this.highlightBoxes[key].onClick();
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
    this.drawBiofilter();
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
    // Clean the seedlings area
    this.ereaseRect(
      this.highlightBoxes['seedling1Box'].x,
      this.highlightBoxes['seedling1Box'].y,
      this.highlightBoxes['seedling1Box'].width,
      this.highlightBoxes['seedling3Box'].height + (this.highlightBoxes['seedling3Box'].y - this.highlightBoxes['seedling1Box'].y)
    );

    for (let i = 1; i <= 3; i++) {
      if (this.plantedSeeds[i - 1]) {
        this.drawImage(
          this.tokenImages[`seedling${i}Img`]
        );
      } else if (this.currentStep == 2) {
        this.setTokenImageSize(this.highlightBoxes[`seedling${i}Box`]);
        this.highlightBoxes[`seedling${i}Box`].setVisibility(true);
        this.highlightBoxes[`seedling${i}Box`].setClickability(this.currentMoney > 0);
        this.roundedRect(
          this.interactiveContext,
          this.highlightBoxes[`seedling${i}Box`].x,
          this.highlightBoxes[`seedling${i}Box`].y,
          this.highlightBoxes[`seedling${i}Box`].width,
          this.highlightBoxes[`seedling${i}Box`].height,
          this.adjustmentRatio * this.highlightBoxes[`seedling${i}Box`].radius,
          this.currentMoney > 0 ? this.highlightBoxes[`seedling${i}Box`].fillColor : this.disabledColor
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
    this.ereaseRect(
      this.highlightBoxes['pumpBox'].x,
      this.highlightBoxes['pumpBox'].y,
      this.highlightBoxes['pumpBox'].width,
      this.highlightBoxes['pumpBox'].height
    );
    if (this.isPump) {
      this.drawImage(
        this.tokenImages['pumpImg']
      );
    } else if (this.currentStep == 2) {
      this.setTokenImageSize(this.highlightBoxes['pumpBox']);
      this.highlightBoxes['pumpBox'].setVisibility(true);
      this.highlightBoxes['pumpBox'].setClickability(true);
      this.roundedRect(
        this.interactiveContext,
        this.highlightBoxes['pumpBox'].x,
        this.highlightBoxes['pumpBox'].y,
        this.highlightBoxes['pumpBox'].width,
        this.highlightBoxes['pumpBox'].height,
        this.adjustmentRatio * this.highlightBoxes['pumpBox'].radius,
        this.currentMoney > 0 ? this.highlightBoxes['pumpBox'].fillColor : this.disabledColor
      )
    }
  }

  drawBiofilter(): void {
    this.ereaseRect(
      this.highlightBoxes['biofilterBox'].x,
      this.highlightBoxes['biofilterBox'].y,
      this.highlightBoxes['biofilterBox'].width,
      this.highlightBoxes['biofilterBox'].height
    );
    if (this.isBiofilter) {
      this.drawImage(
        this.tokenImages['biofilterImg']
      );
    } else if (this.currentStep == 2) {
      this.setTokenImageSize(this.highlightBoxes['biofilterBox']);
      this.highlightBoxes['biofilterBox'].setVisibility(true);
      this.highlightBoxes['biofilterBox'].setClickability(true);
      this.roundedRect(
        this.interactiveContext,
        this.highlightBoxes['biofilterBox'].x,
        this.highlightBoxes['biofilterBox'].y,
        this.highlightBoxes['biofilterBox'].width,
        this.highlightBoxes['biofilterBox'].height,
        this.adjustmentRatio * this.highlightBoxes['biofilterBox'].radius,
        this.currentMoney > 0 ? this.highlightBoxes['biofilterBox'].fillColor : this.disabledColor
      )
    }
  }

  drawFishTank(): void {
    this.ereaseRect(
      this.highlightBoxes['alevin1Box'].x,
      this.highlightBoxes['alevin1Box'].y,
      this.highlightBoxes['alevin1Box'].width,
      this.highlightBoxes['alevin1Box'].height
    );

    for (let i = 1; i <= 3; i++) {
      if (this.fishesInTank[i - 1]) {
        this.drawImage(
          this.tokenImages[`alevin${i}Img`]
        );
      }
    }

    if (this.currentStep == 2 && !this.fishesInTank[0]) {
      this.setTokenImageSize(this.highlightBoxes['alevin1Box']);
      this.highlightBoxes['alevin1Box'].setVisibility(true);
      this.highlightBoxes['alevin1Box'].setClickability(true);
      this.hexagon(
        this.interactiveContext,
        this.highlightBoxes['alevin1Box'].x,
        this.highlightBoxes['alevin1Box'].y,
        this.highlightBoxes['alevin1Box'].width,
        this.highlightBoxes['alevin1Box'].height,
        this.currentMoney > 0 ? this.highlightBoxes['alevin1Box'].fillColor : this.disabledColor
      );
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
    // Clear the money area
    this.ereaseRect(
      this.highlightBoxes['moneyBox'].x,
      this.highlightBoxes['moneyBox'].y,
      this.highlightBoxes['moneyBox'].width,
      this.highlightBoxes['moneyBox'].height);

    // Draw the money value
    this.interactiveContext.font = `${this.boardWidth * 0.04}px source-sans-pro,sans-serif`;
    this.interactiveContext.fillStyle = '#000'
    this.interactiveContext.fillText(
      `$ ${this.currentMoney}`,
      this.dx + (this.boardWidth * 0.91),
      this.dy + (this.boardHeight * 0.214)
    )

    // Draw the money highlight box in case it can be clicked
    this.highlightBoxes['moneyBox'].setVisibility(this.currentStep == 1);
    this.highlightBoxes['moneyBox'].setClickability(this.currentStep == 1);
    this.setTokenImageSize(this.highlightBoxes['moneyBox']);
    if (this.highlightBoxes['moneyBox'].getVisibility()) {
      this.roundedRect(
        this.interactiveContext,
        this.highlightBoxes['moneyBox'].x,
        this.highlightBoxes['moneyBox'].y,
        this.highlightBoxes['moneyBox'].width,
        this.highlightBoxes['moneyBox'].height,
        this.adjustmentRatio * this.highlightBoxes['moneyBox'].radius,
        this.highlightBoxes['moneyBox'].fillColor
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
    ctx.lineTo(x + width * 0.75, y + height);
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

  hexagon(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillStyle: string) {
    ctx.beginPath();
    ctx.moveTo(x + width * 0.25, y);
    ctx.lineTo(x + width * 0.75, y);
    ctx.lineTo(x + width, y + height * 0.5);
    ctx.lineTo(x + width * 0.75, y + height);
    ctx.lineTo(x + width * 0.25, y + height);
    ctx.lineTo(x, y + height * 0.5);
    ctx.lineTo(x + width * 0.25, y);
    ctx.lineTo(x, y);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  setTokenImageSize(img: tokenImage | highlightBox): void {
    // Original image dimensions
    if (img instanceof tokenImage) {
      img.width = img.image.width * this.adjustmentRatio * img.ratio;
      img.height = img.image.height * this.adjustmentRatio * img.ratio;
    } else {
      img.width = img.percentWidth * this.boardWidth;
      img.height = img.percentHeight * this.boardHeight;
    }

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

  ereaseRect(x: number, y: number, width: number, height: number): void {
    // Original image dimensions
    this.interactiveContext.clearRect(x - 1, y - 1, width + 1, height + 1);
  }

  isInside(mouseX: number, mouseY: number, upperX: number, upperY: number, width: number, height: number) {
    return (mouseX >= upperX && mouseX <= (upperX + width) && mouseY >= upperY && mouseY <= (upperY + height));
  }
}
