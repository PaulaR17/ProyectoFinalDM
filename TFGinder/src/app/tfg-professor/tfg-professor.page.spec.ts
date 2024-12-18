import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TFGProfessorPage } from './tfg-professor.page';

describe('TFGProfessorPage', () => {
  let component: TFGProfessorPage;
  let fixture: ComponentFixture<TFGProfessorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TFGProfessorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
