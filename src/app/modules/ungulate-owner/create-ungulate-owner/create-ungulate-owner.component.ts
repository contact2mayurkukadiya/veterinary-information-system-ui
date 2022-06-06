import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENDPOINTS } from '../../../Shared/Constants/endpoints.constant';
import { DataService } from '../../../Shared/Services/data.service';
import { ModalService } from '../../../Shared/Services/modal.service';
import { UtilityService } from '../../../Shared/Services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { UngulateOwner } from '../../../Shared/Models/ungulate-owner.model';
import { ERRORS } from '../../../Shared/Constants/errors.constant';
import { District, Municipality, Place } from '../../../Shared/Models/location.model';

@Component({
  selector: 'app-create-ungulate-owner',
  templateUrl: './create-ungulate-owner.component.html',
  styleUrls: ['./create-ungulate-owner.component.css']
})
export class CreateUngulateOwnerComponent implements OnInit {

  ungulateOwnerForm: FormGroup;

  districtList: Array<District> = [];
  municipalityList: Array<Municipality> = [];
  placesList: Array<Place> = [];

  loading: boolean = false;
  mode: 'create' | 'edit' = 'create';
  editId: string = null;
  inputData: UngulateOwner;
  pageTitle: string = 'Профил власника копитара';
  ownerType: 'individual' | 'legal' = 'individual';

  constructor(private dataservice: DataService, private modal: ModalService, private utility: UtilityService, private route: ActivatedRoute) {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.mode = 'edit';
      try {
        this.inputData = JSON.parse(localStorage.getItem('editOwnerData'));
        if (!this.utility.isEmptyString(this.inputData?.companyName || '') && !this.utility.isEmptyString(this.inputData?.companyIdentificationNumber || '')) {
          this.ownerType = 'legal';
        } else {
          this.ownerType = 'individual';
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  async ngOnInit() {
    this.createOrResetForm(this.mode === 'edit' ? this.inputData : null);
    this.getDestricts();
    if (this.mode === 'edit') {
      await this.getMunicipality(this.inputData.district);
      await this.getPlaces(this.inputData.municipality);
    }
  }

  createOrResetForm(data: UngulateOwner = null) {
    this.ungulateOwnerForm = new FormGroup({
      name: new FormControl(data?.name ?? '', [Validators.required, Validators.maxLength(50)]),
      surname: new FormControl(data?.surname ?? '', [Validators.required, Validators.maxLength(50)]),
      companyName: new FormControl(data?.surname ?? '', [Validators.required, Validators.maxLength(50)]),
      identificationNumber: new FormControl(data?.identificationNumber ?? '', [Validators.required, Validators.maxLength(13)]),
      companyIdentificationNumber: new FormControl(data?.identificationNumber ?? '', [Validators.required, Validators.maxLength(13)]),
      passport: new FormControl(data?.passport ?? '', [Validators.maxLength(100)]),
      district: new FormControl(data?.district ?? '', [Validators.required]),
      municipality: new FormControl(data?.municipality ?? '', [Validators.required]),
      place: new FormControl(data?.place ?? '', [Validators.required]),
      address: new FormControl(data?.address ?? '', [Validators.required]),
      phone: new FormControl(data?.phone ?? '', [Validators.required]),
      active: new FormControl(data?.active != undefined && data?.active != null ? data?.active : true)
    });
    this.checkOwnerTypeAndApplyValidation();
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.ungulateOwnerForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateOwnerForm.valid) {
      if (this.mode === 'edit') {
        this.ungulateOwnerForm.disable();
        this.loading = true;
        const requestData = { ...this.ungulateOwnerForm.value };
        delete requestData.active;
        this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_OWNER.MODIFY, { id: this.editId }), requestData).then((result) => {
          this.ungulateOwnerForm.enable();
          // this.resetUpdateMode();
          // this.modal.showSuccess("Updated Successfully", 3000)
          this.modal.showSuccess('Ажуриран успешно', 3000);
          this.loading = false;
        }, (error) => {
          console.log('error', error);
          this.ungulateOwnerForm.enable();
          this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
          this.loading = false;
        });
      } else {
        this.ungulateOwnerForm.disable();
        this.loading = true;
        let APIURL = ENDPOINTS.UNGULATE_OWNER.CREATE_INDIVIDUAL;
        if (this.ownerType == 'legal') {
          APIURL = this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE_OWNER.CREATE_LEGAL_ENTITY, { companyIdentificationNumber: this.ungulateOwnerForm.value.companyIdentificationNumber })
        }

        this.dataservice.POST(APIURL, this.ungulateOwnerForm.value).then((result) => {
          this.ungulateOwnerForm.enable();
          this.modal.showSuccess('Цреатед Суццессфулли', 3000);
          this.createOrResetForm();
          this.loading = false;
        }, (error) => {
          console.log('error', error);
          this.ungulateOwnerForm.enable();
          this.modal.showError(ERRORS.COMMON.INTERNAL_SERVER_ERROR);
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
    this.ungulateOwnerForm.patchValue({ municipality: '', place: '' });
    this.placesList = [];
  }

  handleMunicipalityChange(municipality) {
    if (municipality) {
      this.getPlaces(municipality);
    } else {
      this.placesList = [];
    }
    this.ungulateOwnerForm.patchValue({ place: '' });
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

  compareObjectById(first, second) {
    return first && second && first.id === second.id;
  }

  ownerTypeChange() {
    console.log(this.ownerType);
    this.checkOwnerTypeAndApplyValidation();
  }

  checkOwnerTypeAndApplyValidation() {
    const commonValidationFor50 = [Validators.required, Validators.maxLength(50)];
    const commonValidationFor13 = [Validators.required, Validators.maxLength(13)];
    if (this.ownerType === 'individual') {
      this.setValidation(this.ungulateOwnerForm, 'name', commonValidationFor50);
      this.setValidation(this.ungulateOwnerForm, 'surname', commonValidationFor50);
      this.setValidation(this.ungulateOwnerForm, 'identificationNumber', commonValidationFor13);
      this.clearValidation(this.ungulateOwnerForm, 'companyName');
      this.clearValidation(this.ungulateOwnerForm, 'companyIdentificationNumber');
    } else if (this.ownerType === 'legal') {
      this.setValidation(this.ungulateOwnerForm, 'companyName', commonValidationFor50);
      this.setValidation(this.ungulateOwnerForm, 'companyIdentificationNumber', commonValidationFor13);
      this.clearValidation(this.ungulateOwnerForm, 'name');
      this.clearValidation(this.ungulateOwnerForm, 'surname');
      this.clearValidation(this.ungulateOwnerForm, 'identificationNumber');
    }
  }

  setValidation(form: FormGroup, control: string, validation) {
    form.controls[control].setValidators(validation);
  }

  clearValidation(form: FormGroup, control) {
    form.controls[control].clearValidators();
  }
}
