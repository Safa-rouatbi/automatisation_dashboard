import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesIndicateursComponent } from './kpi-cartes.component';

describe('CartesIndicateursComponent', () => {
  let component: CartesIndicateursComponent;
  let fixture: ComponentFixture<CartesIndicateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartesIndicateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartesIndicateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
