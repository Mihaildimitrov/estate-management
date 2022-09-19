import { TestBed } from '@angular/core/testing';

import { GetEstateGuard } from './get-estate.guard';

describe('GetEstateGuard', () => {
  let guard: GetEstateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GetEstateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
