import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalirPage } from './salir.page';

describe('SalirPage', () => {
  let component: SalirPage;
  let fixture: ComponentFixture<SalirPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SalirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
