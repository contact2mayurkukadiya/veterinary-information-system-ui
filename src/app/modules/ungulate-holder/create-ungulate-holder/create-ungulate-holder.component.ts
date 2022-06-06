import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ENDPOINTS } from '../../../Shared/Constants/endpoints.constant';
import { DataService } from '../../../Shared/Services/data.service';
import { ModalService } from '../../../Shared/Services/modal.service';
import { UtilityService } from '../../../Shared/Services/utility.service';
import * as queryString from 'query-string';
import { UngulateHolder } from '../../../Shared/Models/ungulate-holder.model';
import { ActivatedRoute } from '@angular/router';
import { District, Municipality, Place } from '../../../Shared/Models/location.model';

@Component({
  selector: 'app-create-ungulate-holder',
  templateUrl: './create-ungulate-holder.component.html',
  styleUrls: ['./create-ungulate-holder.component.css']
})
export class CreateUngulateHolderComponent implements OnInit, OnDestroy {


  ungulateHolderForm: FormGroup;

  farmTypeList: Array<any> = [];
  districtList: Array<District> = [];
  municipalityList: Array<Municipality> = [];
  placesList: Array<Place> = [];

  loading: boolean = false;
  mode: 'create' | 'edit' = 'create';
  editId: string = null;
  inputData: UngulateHolder;
  modalRef: NgbModalRef;

  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService, private route: ActivatedRoute) {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.mode = 'edit';
      try {
        this.inputData = JSON.parse(localStorage.getItem('editHolderData'));
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  async ngOnInit() {
    this.createOrResetForm(this.mode === 'edit' ? this.inputData : null);
    this.getFarms();
    this.getDestricts();
    if (this.mode === 'edit') {
      await this.getMunicipality(this.inputData.district);
      await this.getPlaces(this.inputData.municipality);
    }
  }

  createOrResetForm(data: UngulateHolder = null) {
    this.ungulateHolderForm = new FormGroup({
      hid: new FormControl(data?.hid ?? '', [Validators.required, Validators.maxLength(50)]),
      name: new FormControl(data?.name ?? '', [Validators.required, Validators.maxLength(50)]),
      surname: new FormControl(data?.surname ?? '', [Validators.required, Validators.maxLength(50)]),
      identificationNumber: new FormControl(data?.identificationNumber ?? '', [Validators.required, Validators.maxLength(13)]),
      district: new FormControl(data?.district ?? '', [Validators.required]),
      municipality: new FormControl(data?.municipality ?? '', [Validators.required]),
      place: new FormControl(data?.place ?? '', [Validators.required]),
      address: new FormControl(data?.address ?? '', [Validators.required]),
      phone: new FormControl(data?.phone ?? '', [Validators.required]),
      farmType: new FormControl(data?.farmType ?? '', [Validators.required]),
      active: new FormControl(data?.active !== undefined && data?.active != null ? data?.active : true)
    });
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.ungulateHolderForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateHolderForm.valid) {
      if (this.mode === 'edit') {
        this.ungulateHolderForm.disable();
        this.loading = true;
        const requestData = { ...this.ungulateHolderForm.value };
        delete requestData.active;
        this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_HOLDER.MODIFY, { id: this.editId }), requestData).then((result) => {
          this.ungulateHolderForm.enable();
          // this.resetUpdateMode();
          // this.modal.showSuccess("Updated Successfully", 3000)
          this.modal.showSuccess('Ажуриран успешно', 3000);
          this.loading = false;
        }, (error) => {
          console.log('error', error);
          this.ungulateHolderForm.enable();
          this.loading = false;
        });
      } else {
        this.ungulateHolderForm.disable();
        this.loading = true;
        this.dataservice.POST(ENDPOINTS.UNGULATE_HOLDER.CREATE, this.ungulateHolderForm.value).then((result) => {
          this.ungulateHolderForm.enable();
          this.modal.showSuccess('Цреатед Суццессфулли', 3000);
          // this.createOrResetForm();
          this.loading = false;
        }, (error) => {
          console.log('error', error);
          this.ungulateHolderForm.enable();
          this.loading = false;
        });
      }
    }
  }

  resetUpdateMode() {
    this.mode = 'create';
    this.inputData = null;
    this.createOrResetForm();
  }

  trackByIndex(index) {
    return index;
  }

  handleDistrictChange(district) {
    if (district) {
      this.getMunicipality(district);
    } else {
      this.municipalityList = [];
      this.placesList = [];
    }
    this.ungulateHolderForm.patchValue({ municipality: '', place: '' });
    this.placesList = [];
  }

  handleMunicipalityChange(municipality) {
    if (municipality) {
      this.getPlaces(municipality);
    } else {
      this.placesList = [];
    }
    this.ungulateHolderForm.patchValue({ place: '' });
  }

  getDestricts() {
    this.dataservice.GET(ENDPOINTS.EXTRA_SERVICES.GETDISTRICTS).then(districts => {
      this.districtList = districts.content;
    }, error => {
      console.log('error', error);
    });
  }

  getMunicipality(district: District) {
    this.dataservice.GET(this.utility.parseDataIntoUrl(ENDPOINTS.EXTRA_SERVICES.GETMUNICIPALITIES, { id: district.id })).then((municipalities: { content: { municipalities: Array<Municipality> }, error: any }) => {
      this.municipalityList = municipalities.content.municipalities;
    }, error => {
      console.log('error', error);
    });
  }

  getPlaces(municipality) {
    this.dataservice.GET(this.utility.parseDataIntoUrl(ENDPOINTS.EXTRA_SERVICES.GETPLACES, { id: municipality.id })).then((places: { content: { places: Array<Municipality> }, error: any }) => {
      this.placesList = places.content.places;
    }, error => {
      console.log('error', error);
    });
  }

  getFarms() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.FARM_TYPE.RETRIEVE_ALL}?${queryString.stringify(qs)}`).then(farmTypes => {
      this.farmTypeList = farmTypes.content;
    }).catch(error => {
      console.log('error', error);
    });
  }

  compareObjectById(first, second) {
    return first && second && first.id === second.id;
  }

  ngOnDestroy() {
    this.resetUpdateMode();
    localStorage.removeItem('editHolderData');
  }
}
