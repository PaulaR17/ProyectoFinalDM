import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TFGStudentPageRoutingModule } from './tfg-student-routing.module';

import { TFGStudentPage } from './tfg-student.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TFGStudentPageRoutingModule
  ],
  declarations: [TFGStudentPage]
})
export class TFGStudentPageModule {}
