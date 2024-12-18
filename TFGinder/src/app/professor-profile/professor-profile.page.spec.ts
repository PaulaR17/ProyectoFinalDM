import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorProfilePage } from './professor-profile.page';

describe('ProfessorProfilePage', () => {
  let component: ProfessorProfilePage;
  let fixture: ComponentFixture<ProfessorProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
