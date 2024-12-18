import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfessorProfilePage } from './professor-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfessorProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorProfilePageRoutingModule {}
