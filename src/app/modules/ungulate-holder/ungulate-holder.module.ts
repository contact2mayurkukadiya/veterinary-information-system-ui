import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UngulateHolderRoutingModule} from './ungulate-holder-routing.module';
import {CreateUngulateHolderComponent} from './create-ungulate-holder/create-ungulate-holder.component';
import {SharedModule} from '../../Shared/shared.module';
import {RegisterUngulateHolderComponent} from './register-ungulate-holder/register-ungulate-holder.component';

@NgModule({
  declarations: [CreateUngulateHolderComponent, RegisterUngulateHolderComponent],
  imports: [
    CommonModule,
    UngulateHolderRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CreateUngulateHolderComponent
  ]
})

export class UngulateHolderModule {

}
