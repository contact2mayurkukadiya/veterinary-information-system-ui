import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ENDPOINTS} from '../../../Shared/Constants/endpoints.constant';
import {DataService} from '../../../Shared/Services/data.service';
import {ModalService} from '../../../Shared/Services/modal.service';
import {UtilityService} from '../../../Shared/Services/utility.service';
import * as queryString from 'query-string';
import {ERRORS} from '../../../Shared/Constants/errors.constant';

@Component({
  selector: 'app-ungulate-purpose-view',
  templateUrl: './ungulate-purpose-view.component.html',
  styleUrls: ['./ungulate-purpose-view.component.css']
})

export class UngulatePurposeViewComponent implements OnInit {

  @ViewChild('customModal')
  public modalContent: TemplateRef<any>;
  loading: boolean = false;
  pageNumber: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  filterQuery: string = '';
  purposeData: Array<any> = [];
  modalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;
  modalTitle: 'Профил намене копитара' = 'Профил намене копитара';
  purposeForm: FormGroup;
  editMode: boolean = false;
  editingId: any;
  isSearching: boolean = false;
  private options: NgbModalOptions = {
    centered: true,
    keyboard: true,
  };

  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService) {
  }

  ngOnInit(): void {
    this.createOrResetForm();
    this.getPurposes().then();
  }

  createOrResetForm() {
    this.purposeForm = new FormGroup({
      purpose: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      active: new FormControl(true)
    });
  }

  getPurposes(pageNumber = 0): Promise<any> {
    return new Promise((resolve) => {
      this.loading = true;
      const qs = {
        pageNumber: pageNumber, pageSize: this.pageSize
      };

      if (!this.utility.isEmptyString(this.filterQuery) && this.isSearching) {
        qs['name'] = this.filterQuery;
      } else if (this.isSearching && this.utility.isEmptyString(this.filterQuery)) {
        this.isSearching = false;
      }

      this.dataservice.GET(`${ENDPOINTS.UNGULATE_PURPOSE.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then(res => {
        this.loading = false;
        this.purposeData = res.content;
        this.totalItems = res.totalElements;
        this.pageNumber = res.pageable.pageNumber + 1;
        this.totalPages = res.totalPages;
        resolve(res);
      }).catch(() => {
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        this.loading = false;
      });
    });
  }

  searchData(searchQuery) {
    if (!this.utility.isEmptyString(searchQuery)) {
      this.pageNumber = 1;
      this.isSearching = true;
      this.getPurposes(this.pageNumber - 1).then();
    } else {
      this.isSearching = false;
      this.getPurposes(this.pageNumber - 1).then();
    }
  }

  createUngulatePurpose() {
    this.editMode = false;
    this.createOrResetForm();
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  updateUngulatePurpose(item) {
    this.editMode = true;
    this.patchValues(item);
    this.editingId = item.id;
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  patchValues(data) {
    this.purposeForm.patchValue({
      purpose: data.purpose ?? ''
    });
  }

  deactivateUngulatePurpose(item) {
    this.loading = true;
    this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_PURPOSE.MODIFY, {id: item.id}), item)
      .then(() => {
        this.loading = false;
      }, () => {
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        this.loading = false;
      });
  }

  pageChanged(event) {
    if (!this.loading) {
      this.pageNumber = event.page;
      this.getPurposes(this.pageNumber - 1).then();
    }
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.purposeForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (!this.purposeForm.valid) {
      return;
    }

    const requestData = {
      ...this.purposeForm.value
    };

    this.loading = true;

    if (this.editMode === true) {
      delete requestData.active;
      this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_PURPOSE.MODIFY, {id: this.editingId}), requestData)
        .then(result => {
          this.loading = false;
          this.purposeData = this.purposeData.map(item => {
            return item.id === this.editingId ? result.content : item;
          });
          this.modalRef.close();
        }, () => {
          this.loading = false;
          this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        });
    } else {
      this.dataservice.POST(ENDPOINTS.UNGULATE_PURPOSE.CREATE, requestData).then(result => {
        this.purposeData.push(result.content);
        this.loading = false;
        this.modalRef.close();
      }, () => {
        this.loading = false;
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      });
    }
  }

  deleteUngulatePurpose(item) {
    this.deleteModalRef = this.modal.createConfirmationModal({
      title: 'Да ли сте сигурни да желите да извршите ову радњу?',
      yesText: 'Да',
      noText: 'Не',
    }, this.options);

    this.deleteModalRef.result.then(res => {
      if (res === true) {
        this.dataservice.DELETE(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_PURPOSE.DELETE, {id: item.id}))
          .then(() => {
            this.purposeData = this.purposeData.filter(purpose => {
              return purpose.id !== item.id;
            });
            this.loading = false;
          }, () => {
            this.loading = false;
            this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
          });
      }
    }, () => {
      this.loading = false;
    });
  }
}
