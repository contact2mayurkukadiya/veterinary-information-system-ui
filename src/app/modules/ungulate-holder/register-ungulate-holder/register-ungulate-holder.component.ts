import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ENDPOINTS} from '../../../Shared/Constants/endpoints.constant';
import {DataService} from '../../../Shared/Services/data.service';
import {ModalService} from '../../../Shared/Services/modal.service';
import {UtilityService} from '../../../Shared/Services/utility.service';
import {UngulateHolder, UngulateHolderFilterOptions} from '../../../Shared/Models/ungulate-holder.model';
import {ERRORS} from '../../../Shared/Constants/errors.constant';
import * as queryString from 'query-string';

@Component({
  selector: 'app-register-ungulate-holder',
  templateUrl: './register-ungulate-holder.component.html',
  styleUrls: ['./register-ungulate-holder.component.css']
})

export class RegisterUngulateHolderComponent implements OnInit {

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

  filterQuery: UngulateHolderFilterOptions = {};
  farmTypeData: Array<any> = [];

  modalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;

  modalTitle: 'Додај тип газдинства' | 'Измени тип газдинства' = 'Додај тип газдинства';
  ungulateHolderForm: FormGroup;
  // Update farm type
  editMode: boolean = false;
  editingId: any;

  isSearching: boolean = false;


  ungulateHolderList: Array<UngulateHolder> = [];


  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService, private ngbModal: NgbModal, private router: Router) {
  }

  ngOnInit(): void {
    this.createOrResetForm();
    this.getUngulateHolders();
  }

  createOrResetForm() {
    this.ungulateHolderForm = new FormGroup({
      hid: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      identificationNumber: new FormControl('', [Validators.required, Validators.maxLength(13)]),
    });
  }

  createFilterForm() {
    this.ungulateHolderForm = new FormGroup({
      hid: new FormControl('', [Validators.maxLength(50)]),
      name: new FormControl('', [Validators.maxLength(50)]),
      surname: new FormControl('', [Validators.maxLength(50)]),
      identificationNumber: new FormControl('', [Validators.maxLength(13)]),
    });
  }

  filterUngulateHolder() {
    this.editMode = false;
    this.isSearching = true;
    this.createFilterForm();
    if (!this.utility.isEmptyJSON(this.filterQuery)) {
      this.patchValues(this.filterQuery);
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
    });
  }

  updateUngulateHolder(item) {
    localStorage.setItem('editHolderData', JSON.stringify(item));
    this.router.navigate(['/dashboard/drzalac-kopitara/profil', item.id]);
  }

  patchValues(data) {
    this.ungulateHolderForm.patchValue({
      hid: data.hid ?? '',
      name: data.name ?? '',
      surname: data.surname ?? '',
      identificationNumber: data.identificationNumber ?? '',
    });
  }

  submitForm() {
    this.utility.forEachContorl(this.ungulateHolderForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateHolderForm.valid) {
      this.modalRef.close(this.ungulateHolderForm.value);
    }
  }

  getUngulateHolders(pageNumber = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      let qs = {
        pageNumber: pageNumber,
        pageSize: this.pageSize
      };
      if (this.isSearching === true && !this.utility.isEmptyJSON(this.filterQuery)) {
        qs = {...qs, ...this.utility.skipNullFields(this.filterQuery)};
      } else if (this.isSearching === true && this.utility.isEmptyJSON(this.filterQuery)) {
        this.isSearching = false;
      }
      this.dataservice.GET(`${ENDPOINTS.UNGULATE_HOLDER.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then((result) => {
        this.ungulateHolderList = result.content;
        this.totalItems = result.totalElements;
        this.pageNumber = result.pageable.pageNumber + 1;
        this.totalPages = result.totalPages;
        this.loading = false;
        resolve(result);
      }, (error) => {
        console.log('error', error);
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      });
    });
  }

  pageChanged(event) {
    if (!this.loading) {
      this.pageNumber = event.page;
      this.getUngulateHolders(this.pageNumber - 1).then();
    }
  }

  searchData(searchQuery) {
    if (!this.utility.isEmptyJSON(searchQuery)) {
      this.pageNumber = 1;
      this.isSearching = true;
      this.getUngulateHolders(this.pageNumber - 1).then();
    }
  }

  deactivateungulateHolder(item) {
    this.loading = true;
    this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_HOLDER.MODIFY, { id: item.id }), item).then(response => {
      this.loading = false;
    }, error => {
      console.log('error: ', error);
      this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
      this.loading = false;
    });
  }

  resetFilters() {
    if (this.isSearching === true) {
      this.filterQuery = {};
      this.createOrResetForm();
      this.isSearching = false;
      this.editMode = false;
      this.getUngulateHolders().then();
      this.modalRef.close(null);
    }
  }
}
