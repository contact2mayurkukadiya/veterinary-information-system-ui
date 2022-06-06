import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UngulateRoutingModule} from './ungulate-routing.module';
import {CreateUngulateComponent} from './create-ungulate/create-ungulate.component';
import {RegisterUngulateComponent} from './register-ungulate/register-ungulate.component';
import {SharedModule} from '../../Shared/shared.module';

@NgModule({
  declarations: [CreateUngulateComponent, RegisterUngulateComponent],
  imports: [
    CommonModule,
    UngulateRoutingModule,
    SharedModule
  ]
})

export class UngulateModule {
}
