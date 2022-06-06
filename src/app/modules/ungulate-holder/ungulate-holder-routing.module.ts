import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateUngulateHolderComponent} from './create-ungulate-holder/create-ungulate-holder.component';
import {RegisterUngulateHolderComponent} from './register-ungulate-holder/register-ungulate-holder.component';

const routes: Routes = [
  {
    path: '',
    component: CreateUngulateHolderComponent,
    data: {
      title: 'Профил држалаца копитара'
    },
  },
  {
    path: 'profil',
    component: CreateUngulateHolderComponent,
    data: {
      title: 'Профил држалаца копитара'
    },
  },
  {
    path: 'profil/:id',
    component: CreateUngulateHolderComponent,
    data: {
      title: 'Профил држалаца копитара'
    },
  },
  {
    path: 'registar',
    component: RegisterUngulateHolderComponent,
    data: {
      title: 'Регистар држалаца копитара'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UngulateHolderRoutingModule {

}
