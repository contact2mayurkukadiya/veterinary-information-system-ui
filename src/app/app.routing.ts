import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent} from './containers';
import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';

// noinspection SpellCheckingInspection
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'dashboard',
    component: DefaultLayoutComponent,
    data: {
      title: 'Почетна'
    },
    children: [
      {
        path: 'tip-gazdinstva',
        loadChildren: () => import('./modules/farm-type/farm-type.module').then(m => m.FarmTypeModule),
        data: {
          title: 'Тип газдинства'
        },
      },
      {
        path: 'namena-kopitara',
        loadChildren: () => import('./modules/ungulate-purpose/ungulate-purpose.module').then(m => m.UngulatePurposeModule),
        data: {
          title: 'Намена копитара'
        },
      },
      {
        path: 'rasa-kopitara',
        loadChildren: () => import('./modules/ungulate-race/ungulate-race.module').then(m => m.UngulateRaceModule),
        data: {
          title: 'Раса копитара'
        },
      },
      {
        path: 'drzalac-kopitara',
        loadChildren: () => import('./modules/ungulate-holder/ungulate-holder.module').then(m => m.UngulateHolderModule),
        data: {
          title: 'Држалац копитара'
        },
      },
      {
        path: 'vlasnik-kopitara',
        loadChildren: () => import('./modules/ungulate-owner/ungulate-owner.module').then(m => m.UngulateOwnerModule),
        data: {
          title: 'Власник копитара'
        },
      },
      {
        path: 'kopitari',
        loadChildren: () => import('./modules/ungulate/ungulate.module').then(m => m.UngulateModule),
        data: {
          title: 'Копитари '
        },
      }
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
