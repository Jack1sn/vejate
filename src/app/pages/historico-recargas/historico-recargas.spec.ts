import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoRecargas } from './historico-recargas';

describe('HistoricoRecargas', () => {
  let component: HistoricoRecargas;
  let fixture: ComponentFixture<HistoricoRecargas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoRecargas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoRecargas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
