import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foco } from './foco';

describe('Foco', () => {
  let component: Foco;
  let fixture: ComponentFixture<Foco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
