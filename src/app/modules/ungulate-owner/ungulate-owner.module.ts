import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UngulateOwnerRoutingModule } from './ungulate-owner-routing.module';
import { CreateUngulateOwnerComponent } from './create-ungulate-owner/create-ungulate-owner.component';
import { RegisterUngulateOwnerComponent } from './register-ungulate-owner/register-ungulate-owner.component';
import { SharedModule } from '../../Shared/shared.module';


@NgModule({
  declarations: [CreateUngulateOwnerComponent, RegisterUngulateOwnerComponent],
  imports: [
    CommonModule,
    UngulateOwnerRoutingModule,
    SharedModule
  ]
})

export class UngulateOwnerModule { }
