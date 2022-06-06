import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UngulateRaceRoutingModule} from './ungulate-race-routing.module';
import {UngulateRaceViewComponent} from './ungulate-race-view/ungulate-race-view.component';
import {SharedModule} from '../../Shared/shared.module';

@NgModule({
  declarations: [UngulateRaceViewComponent],
  imports: [
    CommonModule,
    UngulateRaceRoutingModule,
    SharedModule
  ]
})

export class UngulateRaceModule {

}
