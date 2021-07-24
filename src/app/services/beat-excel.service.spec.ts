import { TestBed } from '@angular/core/testing';

import { BeatExcelService } from './beat-excel.service';

describe('BeatExcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeatExcelService = TestBed.get(BeatExcelService);
    expect(service).toBeTruthy();
  });
});
