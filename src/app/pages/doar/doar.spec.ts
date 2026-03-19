import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doar } from './doar';

describe('Doar', () => {
  let component: Doar;
  let fixture: ComponentFixture<Doar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Doar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
