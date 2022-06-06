import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FarmTypeRoutingModule} from './farm-type-routing.module';
import {FarmTypeViewComponent} from './farm-type-view/farm-type-view.component';
import {SharedModule} from '../../Shared/shared.module';

@NgModule({
  declarations: [FarmTypeViewComponent],
  imports: [
    CommonModule,
    FarmTypeRoutingModule,
    SharedModule
  ]
})

export class FarmTypeModule {
}
