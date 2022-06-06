import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UngulatePurposeRoutingModule} from './ungulate-purpose-routing.module';
import {UngulatePurposeViewComponent} from './ungulate-purpose-view/ungulate-purpose-view.component';
import {SharedModule} from '../../Shared/shared.module';

@NgModule({
  declarations: [UngulatePurposeViewComponent],
  imports: [
    CommonModule,
    UngulatePurposeRoutingModule,
    SharedModule
  ]
})

export class UngulatePurposeModule {

}
