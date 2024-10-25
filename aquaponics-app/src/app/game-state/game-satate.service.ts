import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { round } from './round.model';

@Injectable({
  providedIn: 'root'
})
export class GameSatateService {

  roundParams: { [key: number]: round } = {
    1: new round(3),
    2: new round(4),
    3: new round(3),
    4: new round(2),
    5: new round(1)
  };

  private round = new BehaviorSubject<number>(1);
  currentRound$ = this.round.asObservable();

  private step = new BehaviorSubject<number>(1);
  currentStep$ = this.step.asObservable();

  private money = new BehaviorSubject<number>(0);
  currentMoney$ = this.money.asObservable();

  private damage = new BehaviorSubject<number>(0);
  currentDamage$ = this.damage.asObservable();

  private biofilter = new BehaviorSubject<boolean>(false);
  isBiofilter$ = this.biofilter.asObservable();

  private pump = new BehaviorSubject<boolean>(false);
  isPump$ = this.biofilter.asObservable();

  updateRound(newRound: number) {
    this.round.next(newRound);
  }

  updateMoney(newMoney: number) {
    this.money.next(newMoney);
  }

  updateStep(newStep: number) {
    this.step.next(newStep);
  }

  updateDamage(newDamage: number) {
    this.damage.next(newDamage);
  }

  updateBiofilter(newBiofilter: boolean) {
    this.biofilter.next(newBiofilter);
  }

  updatePump(newPump: boolean) {
    this.pump.next(newPump);
  }
}
