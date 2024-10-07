import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {

  @Output() showBoard: EventEmitter<boolean> = new EventEmitter();

  startGame() {
    this.showBoard.emit(true);
  }
}
