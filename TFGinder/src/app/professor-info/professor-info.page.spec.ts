import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorInfoPage } from './professor-info.page';

describe('ProfessorInfoPage', () => {
  let component: ProfessorInfoPage;
  let fixture: ComponentFixture<ProfessorInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
