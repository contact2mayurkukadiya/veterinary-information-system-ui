import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FarmTypeViewComponent} from './farm-type-view/farm-type-view.component';

const routes: Routes = [
  {
    path: '',
    component: FarmTypeViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FarmTypeRoutingModule {
}
