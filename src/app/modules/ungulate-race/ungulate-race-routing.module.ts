import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UngulateRaceViewComponent} from './ungulate-race-view/ungulate-race-view.component';

const routes: Routes = [
  {
    path: '',
    component: UngulateRaceViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UngulateRaceRoutingModule {
}
