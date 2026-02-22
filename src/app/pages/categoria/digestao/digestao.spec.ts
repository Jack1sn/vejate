import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Digestao } from './digestao';

describe('Digestao', () => {
  let component: Digestao;
  let fixture: ComponentFixture<Digestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Digestao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Digestao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
