import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgIf } from '@angular/common';
import { BoardComponent } from './board/board.component';
import { ControlsPanelComponent } from './controls-panel/controls-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, WelcomeComponent, BoardComponent, ControlsPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showBoard: boolean = true;

  setShowBoard(show: boolean) {
    this.showBoard = show;
    console.log(this.showBoard);
  }
}
