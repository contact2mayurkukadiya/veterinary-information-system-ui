import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UngulatePurposeViewComponent} from './ungulate-purpose-view/ungulate-purpose-view.component';

const routes: Routes = [{
  path: '',
  component: UngulatePurposeViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UngulatePurposeRoutingModule {

}
