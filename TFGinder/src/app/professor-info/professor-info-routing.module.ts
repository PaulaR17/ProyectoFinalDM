import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfessorInfoPage } from './professor-info.page';

const routes: Routes = [
  {
    path: '',
    component: ProfessorInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorInfoPageRoutingModule {}
