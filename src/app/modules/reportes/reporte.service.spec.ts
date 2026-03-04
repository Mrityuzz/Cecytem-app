/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReporteService } from './reporte.service';

describe('Service: Reporte', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteService]
    });
  });

  it('should ...', inject([ReporteService], (service: ReporteService) => {
    expect(service).toBeTruthy();
  }));
});
