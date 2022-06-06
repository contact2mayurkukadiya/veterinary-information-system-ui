import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipe } from './Pipes/data-filter.pipe';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './Components/modal/modal.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';
import { NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastsContainerComponent } from './Components/toasts-container/toasts-container.component';



@NgModule({
  declarations: [
    DataFilterPipe,
    ModalComponent,
    ConfirmationComponent,
    ToastsContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbToastModule,
    PaginationModule.forRoot()
  ],
  exports: [
    DataFilterPipe,
    DataTableModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    NgbModalModule,
    NgbToastModule,
    PaginationModule,
    ConfirmationComponent,
    ToastsContainerComponent
  ], providers: [
    BsModalService
  ],
  entryComponents: [
    ConfirmationComponent
  ]
})
export class SharedModule { }
