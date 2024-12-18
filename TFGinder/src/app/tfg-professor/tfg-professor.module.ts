import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TFGProfessorPageRoutingModule } from './tfg-professor-routing.module';

import { TFGProfessorPage } from './tfg-professor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TFGProfessorPageRoutingModule
  ],
  declarations: [TFGProfessorPage]
})
export class TFGProfessorPageModule {}
