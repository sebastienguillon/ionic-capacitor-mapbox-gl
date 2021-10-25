import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Data1Page } from './data1.page';

const routes: Routes = [
  {
    path: '',
    component: Data1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Data1PageRoutingModule {}
