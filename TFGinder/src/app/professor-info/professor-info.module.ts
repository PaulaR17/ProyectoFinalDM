import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfessorInfoPageRoutingModule } from './professor-info-routing.module';

import { ProfessorInfoPage } from './professor-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfessorInfoPageRoutingModule
  ],
  declarations: [ProfessorInfoPage]
})
export class ProfessorInfoPageModule {}
