import {Injectable, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {ConfirmationComponent} from '../Components/confirmation/confirmation.component';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from './toast.service';
import {ConfirmationDataModel} from '../Models/modal.model';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  onDestroy$: Subject<any> = new Subject();

  constructor(private modal: NgbModal, private toast: ToastService) {
  }

  createModal(content: TemplateRef<any> | any, option: NgbModalOptions = null): NgbModalRef {
    return this.modal.open(content, option);
  }

  createConfirmationModal(data: ConfirmationDataModel | null, option: NgbModalOptions = null): NgbModalRef {
    const ref: NgbModalRef = this.createModal(ConfirmationComponent, option);

    if (data !== null) {
      ref.componentInstance.confirmationMessage = data.title;
      ref.componentInstance.yesText = data.yesText;
      ref.componentInstance.noText = data.noText;
    }

    return ref;
  }

  showSuccess(message: string, delay: number = 5000) {
    this.toast.show(message, {classname: 'bg-success text-light rounded toast', delay});
  }

  showError(message: string, delay: number = 5000) {
    this.toast.show(message, {classname: 'bg-danger text-light rounded toast', delay});
  }
}
