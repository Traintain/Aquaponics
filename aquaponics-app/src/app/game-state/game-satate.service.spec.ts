import { TestBed } from '@angular/core/testing';

import { GameSatateService } from './game-satate.service';

describe('GameSatateService', () => {
  let service: GameSatateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSatateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
