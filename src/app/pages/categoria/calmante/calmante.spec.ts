import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calmante } from './calmante';

describe('Calmante', () => {
  let component: Calmante;
  let fixture: ComponentFixture<Calmante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calmante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calmante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
