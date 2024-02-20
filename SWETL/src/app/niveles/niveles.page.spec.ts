import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelesPage } from './niveles.page';

describe('NivelesPage', () => {
  let component: NivelesPage;
  let fixture: ComponentFixture<NivelesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NivelesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
