import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TFGProfessorPage } from './tfg-professor.page';

const routes: Routes = [
  {
    path: '',
    component: TFGProfessorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TFGProfessorPageRoutingModule {}
