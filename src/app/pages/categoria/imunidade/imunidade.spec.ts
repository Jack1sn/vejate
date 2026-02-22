import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Imunidade } from './imunidade';

describe('Imunidade', () => {
  let component: Imunidade;
  let fixture: ComponentFixture<Imunidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Imunidade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Imunidade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
