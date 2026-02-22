import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dor } from './dor';

describe('Dor', () => {
  let component: Dor;
  let fixture: ComponentFixture<Dor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
