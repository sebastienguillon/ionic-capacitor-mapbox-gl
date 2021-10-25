import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Data2PageRoutingModule } from './data2-routing.module';

import { Data2Page } from './data2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Data2PageRoutingModule
  ],
  declarations: [Data2Page]
})
export class Data2PageModule {}
