import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentInfoPage } from './student-info.page';

describe('StudentInfoPage', () => {
  let component: StudentInfoPage;
  let fixture: ComponentFixture<StudentInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
