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
  selector: 'app-ungulate-race-view',
  templateUrl: './ungulate-race-view.component.html',
  styleUrls: ['./ungulate-race-view.component.css']
})
export class UngulateRaceViewComponent implements OnInit {

  @ViewChild('customModal')
  public modalContent: TemplateRef<any>;
  loading: boolean = false;
  pageNumber: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  filterQuery: string = '';
  ungulateRaceList: Array<any> = [];
  modalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;
  modalTitle: 'Профил расе копитара' = 'Профил расе копитара';
  ungulateRaceForm: FormGroup;
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
    this.getUngulateRaceList().then();
  }

  createOrResetForm() {
    this.ungulateRaceForm = new FormGroup({
      race: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      active: new FormControl(true)
    });
  }

  getUngulateRaceList(pageNumber = 0): Promise<any> {
    return new Promise((resolve) => {
      this.loading = true;
      const qs = {
        pageNumber: pageNumber, pageSize: this.pageSize
      };

      if (!this.utility.isEmptyString(this.filterQuery) && this.isSearching === true) {
        qs['race'] = this.filterQuery;
      } else if (this.isSearching === true && this.utility.isEmptyString(this.filterQuery)) {
        this.isSearching = false;
      }

      this.dataservice.GET(`${ENDPOINTS.UNGULATE_RACE.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then(data => {
        this.loading = false;
        this.ungulateRaceList = data.content;
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
      this.getUngulateRaceList(this.pageNumber - 1).then();
    } else {
      this.isSearching = false;
      this.getUngulateRaceList(this.pageNumber - 1).then();
    }
  }

  deactivateUngulateRace(item) {
    this.loading = true;
    this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_RACE.MODIFY, {id: item.id}), item)
      .then(() => {
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  createUngulateRace() {
    this.editMode = false;
    this.createOrResetForm();
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  updateUngulateRace(item) {
    this.editMode = true;
    this.patchValues(item);
    this.editingId = item.id;
    this.modalRef = this.modal.createModal(this.modalContent, this.options);
  }

  patchValues(data) {
    this.ungulateRaceForm.patchValue({
      race: data.race ?? ''
    });
  }

  pageChanged(event) {
    if (!this.loading) {
      this.pageNumber = event.page;
      this.getUngulateRaceList(this.pageNumber - 1).then();
    }
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.ungulateRaceForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (!this.ungulateRaceForm.valid) {
      return;
    }

    const requestData = {
      ...this.ungulateRaceForm.value,
    };

    this.loading = true;

    if (this.editMode === true) {
      delete requestData.active;
      this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_RACE.MODIFY, {id: this.editingId}), requestData).then(result => {
        this.loading = false;
        this.ungulateRaceList = this.ungulateRaceList.map(item => {
          return item.id === this.editingId ? result.content : item;
        });
        this.modalRef.close();
      }, () => {
        this.loading = false;
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        this.modalRef.close();
      });
    } else {
      this.dataservice.POST(ENDPOINTS.UNGULATE_RACE.CREATE, requestData).then(result => {
        this.loading = false;
        this.ungulateRaceList.push(result.content);
        this.modalRef.close();
      }, () => {
        this.loading = false;
        this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
        this.modalRef.close();
      });
    }
  }

  deleteUngulateRace(item) {
    this.deleteModalRef = this.modal.createConfirmationModal(null, this.options);
    this.deleteModalRef.result.then(result => {
      if (result === true) {
        this.dataservice.DELETE(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_RACE.DELETE, {id: item.id}))
          .then(() => {
            this.ungulateRaceList = this.ungulateRaceList.filter(race => race.id !== item.id);
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
