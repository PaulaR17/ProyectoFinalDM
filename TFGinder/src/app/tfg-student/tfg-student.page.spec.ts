import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TFGStudentPage } from './tfg-student.page';

describe('TFGStudentPage', () => {
  let component: TFGStudentPage;
  let fixture: ComponentFixture<TFGStudentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TFGStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
