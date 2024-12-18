import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TFGStudentPage } from './tfg-student.page';

const routes: Routes = [
  {
    path: '',
    component: TFGStudentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TFGStudentPageRoutingModule {}
