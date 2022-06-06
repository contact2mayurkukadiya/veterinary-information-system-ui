import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ENDPOINTS } from '../../../Shared/Constants/endpoints.constant';
import { DataService } from '../../../Shared/Services/data.service';
import { ModalService } from '../../../Shared/Services/modal.service';
import { UtilityService } from '../../../Shared/Services/utility.service';
import { ERRORS } from './../../../Shared/Constants/errors.constant';
import * as queryString from 'query-string';
import { UngulateOwner, UngulateOwnerFilterOptions } from '../../../Shared/Models/ungulate-owner.model';

@Component({
  selector: 'app-register-ungulate-owner',
  templateUrl: './register-ungulate-owner.component.html',
  styleUrls: ['./register-ungulate-owner.component.css']
})
export class RegisterUngulateOwnerComponent implements OnInit {
  private options: NgbModalOptions = {
    centered: true,
    keyboard: true,
  };

  @ViewChild('customModal')
  public modalContent: TemplateRef<any>;

  loading: boolean = false;

  pageNumber: number = 0;
  pageSize: number = 2;
  totalItems: number = 0;
  totalPages: number = 1;

  filterQuery: UngulateOwnerFilterOptions = {};
  farmTypeData: Array<any> = [];

  modalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;

  modalTitle: 'Додај тип газдинства' | 'Измени тип газдинства' = 'Додај тип газдинства';
  ungulateOwnerForm: FormGroup;
  // Update farm type
  editMode: boolean = false;
  editingId: any;

  isSearching: boolean = false;


  ungulateOwnerList: Array<UngulateOwner> = [];


  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService, private ngbModal: NgbModal, private router: Router) {
  }

  ngOnInit(): void {
    this.createOrResetForm();
    this.getUngulateOwner();
  }

  createOrResetForm() {
    this.ungulateOwnerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      identificationNumber: new FormControl('', [Validators.required, Validators.maxLength(13)]),
      passport: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      companyName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      companyIdentificationNumber: new FormControl('', [Validators.required, Validators.maxLength(13)]),
    });
  }

  createFilterForm() {
    this.ungulateOwnerForm = new FormGroup({
      name: new FormControl('', [Validators.maxLength(50)]),
      surname: new FormControl('', [Validators.maxLength(50)]),
      identificationNumber: new FormControl('', [Validators.maxLength(13)]),
      passport: new FormControl('', [Validators.maxLength(100)]),
      companyName: new FormControl('', [Validators.maxLength(50)]),
      companyIdentificationNumber: new FormControl('', [Validators.maxLength(13)]),
    });
  }

  filterUngulateOwner() {
    this.editMode = false;
    this.isSearching = true;
    this.createFilterForm();
    if (!this.utility.isEmptyJSON(this.filterQuery)) {
      this.patchValues(this.filterQuery)
    }
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
    this.modalRef.result.then(result => {
      if (result && !this.utility.isEmptyJSON(this.utility.skipNullFields(result)) && !this.utility.isEmptyJSON(result)) {
        this.filterQuery = result;
        this.searchData(this.filterQuery);
      } else {
        this.isSearching = false;
        this.createOrResetForm();
      }
    }, error => {
      console.log('error: ', error);
    })
  }

  updateUngulateOwner(item) {
    localStorage.setItem("editOwnerData", JSON.stringify(item));
    this.router.navigate(["/dashboard/vlasnik-kopitara/profil", item.id]);
  }

  patchValues(data) {
    this.ungulateOwnerForm.patchValue({
      name: data.name ?? '',
      surname: data.surname ?? '',
      identificationNumber: data.identificationNumber ?? '',
      passport: data.passport ?? '',
      companyName: data.companyName ?? '',
      companyIdentificationNumber: data.companyIdentificationNumber ?? '',
    });
  }

  submitForm() {
    this.utility.forEachContorl(this.ungulateOwnerForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateOwnerForm.valid) {
      this.modalRef.close(this.ungulateOwnerForm.value);
    }
  }

  deleteFarmType(item) {
    this.deleteModalRef = this.modal.createConfirmationModal({
      title: 'Да ли сте сигурни да желите да извршите ову операцију?',
      yesText: 'Да',
      noText: 'НЕ'
    }, this.options);

    this.deleteModalRef.result.then(result => {
      if (result === true) {
        // this.dataservice.DELETE(`${ENDPOINTS.FARM_TYPE.DELETE}/${item.id}`).then(response => {
        this.dataservice.DELETE(this.utility.parseDataIntoUrl(ENDPOINTS.FARM_TYPE.DELETE, { id: item.id })).then(response => {
          this.loading = false;
        });
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  getUngulateOwner(pageNumber = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      let qs = {
        pageNumber: pageNumber,
        pageSize: this.pageSize
      }
      if (this.isSearching === true && !this.utility.isEmptyJSON(this.filterQuery)) {
        qs = { ...qs, ...this.utility.skipNullFields(this.filterQuery) };
      } else if (this.isSearching === true && this.utility.isEmptyJSON(this.filterQuery)) {
        this.isSearching = false;
      }
      this.dataservice.GET(`${ENDPOINTS.UNGULATE_OWNER.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then((result) => {
        this.ungulateOwnerList = result.content
        this.totalItems = result.totalElements;
        this.pageNumber = result.pageable.pageNumber + 1;
        this.totalPages = result.totalPages;
        this.loading = false;
        resolve(result);
      }, (error) => {
        console.log("error", error)
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      })
    });
  }

  pageChanged(event) {
    if (!this.loading) {
      this.pageNumber = event.page;
      this.getUngulateOwner(this.pageNumber - 1);
    }
  }

  searchData(searchQuery) {
    if (!this.utility.isEmptyJSON(searchQuery)) {
      this.pageNumber = 1;
      this.isSearching = true;
      this.getUngulateOwner(this.pageNumber - 1);
    }
  }

  deactivateungulateOwner(item) {
    this.loading = true;
    this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_OWNER.MODIFY, { id: item.id }), item).then(response => {
      this.loading = false;
    }, error => {
      console.log('error: ', error);
      this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      this.loading = false;
    });
  }

  resetFilters() {
    if (this.isSearching == true) {
      this.filterQuery = {};
      this.createOrResetForm();
      this.isSearching = false;
      this.editMode = false;
      this.getUngulateOwner();
      this.modalRef.close(null);
    }
  }
}
