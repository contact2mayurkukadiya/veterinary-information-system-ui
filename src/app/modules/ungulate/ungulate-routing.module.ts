import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateUngulateComponent} from './create-ungulate/create-ungulate.component';
import {RegisterUngulateComponent} from './register-ungulate/register-ungulate.component';

const routes: Routes = [
  {
    path: '',
    component: CreateUngulateComponent,
    data: {
      title: 'Профил копитара'
    }
  },
  {
    path: 'profil',
    component: CreateUngulateComponent,
    data: {
      title: 'Профил копитара'
    }
  },
  {
    path: 'profil/:id',
    component: CreateUngulateComponent,
    data: {
      title: 'Профил копитара'
    }
  },
  {
    path: 'registar',
    component: RegisterUngulateComponent,
    data: {
      title: 'Регистар копитара'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UngulateRoutingModule {
}
