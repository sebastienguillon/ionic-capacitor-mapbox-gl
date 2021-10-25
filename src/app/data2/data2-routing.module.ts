import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Data2Page } from './data2.page';

const routes: Routes = [
  {
    path: '',
    component: Data2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Data2PageRoutingModule {}
