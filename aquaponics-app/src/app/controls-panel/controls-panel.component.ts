import { Component, OnInit } from '@angular/core';
import { GameSatateService } from '../game-state/game-satate.service';

@Component({
  selector: 'app-controls-panel',
  standalone: true,
  imports: [],
  templateUrl: './controls-panel.component.html',
  styleUrl: './controls-panel.component.scss'
})
export class ControlsPanelComponent implements OnInit {
  currentRound = 0;
  currentStep = 0;

  constructor(private gameStateService: GameSatateService) { }

  ngOnInit(): void {
    this.gameStateService.currentRound$.subscribe((newRound) => {
      this.currentRound = newRound;
    })

    this.gameStateService.currentStep$.subscribe((newStep) => {
      this.currentStep = newStep;
    })
  }

  nextStage() {
    console.log("Botón continuar");
    this.gameStateService.updateStep(this.currentStep + 1);
    console.log(this.currentRound);
  }
}
