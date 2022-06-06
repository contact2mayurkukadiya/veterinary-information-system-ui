import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ENDPOINTS } from '../../../Shared/Constants/endpoints.constant';
import { DataService } from '../../../Shared/Services/data.service';
import { ModalService } from '../../../Shared/Services/modal.service';
import { UtilityService } from '../../../Shared/Services/utility.service';
import { ERRORS } from '../../../Shared/Constants/errors.constant';
import * as queryString from 'query-string';
import { Ungulate, UngulateFilterOptions } from '../../../Shared/Models/ungulate.model';
import { Country } from '../../../Shared/Models/location.model';


@Component({
  selector: 'app-register-ungulate',
  templateUrl: './register-ungulate.component.html',
  styleUrls: ['./register-ungulate.component.css']
})

export class RegisterUngulateComponent implements OnInit {

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

  filterQuery: UngulateFilterOptions = {};
  ungulateList: Array<Ungulate> = [];

  modalRef: NgbModalRef;

  modalTitle: string = 'Филтер Унгулатес';
  ungulateFilterForm: FormGroup;
  

  editMode: boolean = false;
  editingId: any;

  isSearching: boolean = false;
  ungulateRaceList: Array<any> = [];
  countryList: Array<Country> = [];


  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService, private ngbModal: NgbModal, private router: Router) {
  }

  ngOnInit(): void {
    this.getUngulateRaceList();
    this.getCountries();
    this.createFilterForm();
    this.getUngulates();
  }

  createFilterForm() {
    this.ungulateFilterForm = new FormGroup({
      microchipId: new FormControl(''),
      chippingDate: new FormControl(''),
      ueln: new FormControl(''),
      name: new FormControl(''),
      countryOfBirth: new FormControl(''),
      countryOfOrigin: new FormControl(''),
      ungulateRace: new FormControl(''),
      passport: new FormControl('')
    });
  }

  filterUngulates() {
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
        this.createFilterForm();
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  updateUngulate(item) {
    localStorage.setItem('editUngulateData', JSON.stringify(item));
    this.router.navigate(['/dashboard/kopitari/profil', item.id]);
  }

  patchValues(data: UngulateFilterOptions) {
    this.ungulateFilterForm.patchValue({
      microchipId: data?.microchipId ?? '',
      chippingDate: data?.chippingDate ?? '',
      ueln: data?.ueln ?? '',
      name: data?.name ?? '',
      countryOfBirth: data?.countryOfBirth ?? '',
      countryOfOrigin: data?.countryOfOrigin ?? '',
      ungulateRace: data?.ungulateRace ?? '',
      passport: data?.passport ?? ''
    });
  }

  submitForm() {
    this.utility.forEachContorl(this.ungulateFilterForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateFilterForm.valid) {
      this.modalRef.close(this.ungulateFilterForm.value);
    }
  }

  getCountries() {
    this.dataservice.GET(ENDPOINTS.EXTRA_SERVICES.GETCOUNTRIES).then(countries => {
      this.countryList = countries.content;
    }, error => {
      console.log('error', error);
    });
  }

  getUngulateRaceList() {
    const qs = {pageNumber: 0, pageSize: 1000};
    this.dataservice.GET(`${ENDPOINTS.UNGULATE_RACE.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulateRace => {
        this.ungulateRaceList = ungulateRace.content;
      }).catch(error => {
      console.log('error', error);
    });
  }

  getUngulates(pageNumber = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      let qs = {
        pageNumber: pageNumber,
        pageSize: this.pageSize
      };
      if (this.isSearching === true && !this.utility.isEmptyJSON(this.filterQuery)) {
        qs = { ...qs, ...this.utility.skipNullFields(this.filterQuery) };
      } else if (this.isSearching === true && this.utility.isEmptyJSON(this.filterQuery)) {
        this.isSearching = false;
      }
      this.dataservice.GET(`${ENDPOINTS.UNGULATE.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then((result) => {
        this.ungulateList = result.content;
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
      this.getUngulates(this.pageNumber - 1).then();
    }
  }

  searchData(searchQuery) {
    if (!this.utility.isEmptyJSON(searchQuery)) {
      this.pageNumber = 1;
      this.isSearching = true;
      this.getUngulates(this.pageNumber - 1).then();
    }
  }

  resetFilters() {
    if (this.isSearching === true) {
      this.filterQuery = {};
      this.createFilterForm();
      this.isSearching = false;
      this.editMode = false;
      this.getUngulates();
      this.modalRef.close(null);
    }
  }

  compareObjectById(first, second) {
    return first && second && first.id === second.id;
  }
}