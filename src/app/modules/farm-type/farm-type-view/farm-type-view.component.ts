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
  selector: 'app-farm-type-view',
  templateUrl: './farm-type-view.component.html',
  styleUrls: ['./farm-type-view.component.css']
})

export class FarmTypeViewComponent implements OnInit {

  @ViewChild('customModal')
  public modalContent: TemplateRef<any>;
  loading: boolean = false;
  pageNumber: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  filterQuery: string = '';
  farmTypeData: Array<any> = [];
  modalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;
  modalTitle: 'Профил типа газдинства' = 'Профил типа газдинства';
  farmTypeForm: FormGroup;
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
    this.getFarms().then();
  }

  createOrResetForm() {
    this.farmTypeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      active: new FormControl(true)
    });
  }

  getFarms(pageNumber = 0): Promise<any> {
    return new Promise((resolve) => {
      this.loading = true;
      const qs = {
        pageNumber: pageNumber, pageSize: this.pageSize
      };

      if (!this.utility.isEmptyString(this.filterQuery) && this.isSearching === true) {
        qs['name'] = this.filterQuery;
      } else if (this.isSearching === true && this.utility.isEmptyString(this.filterQuery)) {
        this.isSearching = false;
      }

      this.dataservice.GET(`${ENDPOINTS.FARM_TYPE.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then(data => {
        this.loading = false;
        this.farmTypeData = data.content;
        this.totalItems = data.totalElements;
        this.pageNumber = data.pageable.pageNumber + 1;
        this.totalPages = data.totalPages;
        resolve(data);
      }).catch(() => {
        this.loading = false;
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      });
    });
  }

  searchData(searchQuery) {
    if (!this.utility.isEmptyString(searchQuery)) {
      this.pageNumber = 1;
      this.isSearching = true;
      this.getFarms(this.pageNumber - 1).then();
    } else {
      this.isSearching = false;
      this.getFarms(this.pageNumber - 1).then();
    }
  }

  deactivateFarmType(item) {
    this.loading = true;
    this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.FARM_TYPE.MODIFY, {id: item.id}), item)
      .then(() => {
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  createFarmType() {
    this.editMode = false;
    this.createOrResetForm();
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  updateFarmType(item) {
    this.editMode = true;
    this.patchValues(item);
    this.editingId = item.id;
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  patchValues(data) {
    this.farmTypeForm.patchValue({
      name: data.name ?? ''
    });
  }

  pageChanged(event) {
    if (!this.loading) {
      this.pageNumber = event.page;
      this.getFarms(this.pageNumber - 1).then();
    }
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.farmTypeForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (!this.farmTypeForm.valid) {
      return;
    }

    const requestData = {
      ...this.farmTypeForm.value,
    };

    this.loading = true;
    if (this.editMode === true) {
      delete requestData.active;
      this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.FARM_TYPE.MODIFY, {id: this.editingId}), requestData)
        .then(result => {
          this.loading = false;
          this.farmTypeData = this.farmTypeData.map(item => {
            return item.id === this.editingId ? result.content : item;
          });
          this.modalRef.close();
        }, () => {
          this.loading = false;
          this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
          this.modalRef.close();
        });
    } else {
      this.dataservice.POST(ENDPOINTS.FARM_TYPE.CREATE, requestData).then(result => {
        this.loading = false;
        this.farmTypeData.push(result.content);
        this.modalRef.close();
      }, () => {
        this.loading = false;
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        this.modalRef.close();
      });
    }
  }

  deleteFarmType(item) {
    this.deleteModalRef = this.modal.createConfirmationModal(null, this.options);
    this.deleteModalRef.result.then(result => {
      if (result === true) {
        this.dataservice.DELETE(this.utility.parseDataIntoUrl(ENDPOINTS.FARM_TYPE.DELETE, {id: item.id}))
          .then(() => {
            this.farmTypeData = this.farmTypeData.filter(farmType => farmType.id !== item.id);
            this.loading = false;
          }, () => {
            this.loading = false;
            this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
          });
      }
    }, () => {
      this.loading = false;
      this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
    });
  }
}
