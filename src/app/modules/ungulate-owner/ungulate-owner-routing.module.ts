import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateUngulateOwnerComponent} from './create-ungulate-owner/create-ungulate-owner.component';
import {RegisterUngulateOwnerComponent} from './register-ungulate-owner/register-ungulate-owner.component';

const routes: Routes = [
  {
    path: '',
    component: CreateUngulateOwnerComponent,
    data: {
      title: 'Профил власника копитара'
    }
  },
  {
    path: 'profil',
    component: CreateUngulateOwnerComponent,
    data: {
      title: 'Профил власника копитара'
    }
  },
  {
    path: 'profil/:id',
    component: CreateUngulateOwnerComponent,
    data: {
      title: 'Профил власника копитара'
    }
  },
  {
    path: 'registar',
    component: RegisterUngulateOwnerComponent,
    data: {
      title: 'Регистар власника копитара'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UngulateOwnerRoutingModule {

}
