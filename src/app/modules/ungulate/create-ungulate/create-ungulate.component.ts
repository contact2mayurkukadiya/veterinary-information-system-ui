import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ENDPOINTS } from '../../../Shared/Constants/endpoints.constant';
import { DataService } from '../../../Shared/Services/data.service';
import { ModalService } from '../../../Shared/Services/modal.service';
import { UtilityService } from '../../../Shared/Services/utility.service';
import * as queryString from 'query-string';
import { ActivatedRoute } from '@angular/router';
import { Ungulate } from '../../../Shared/Models/ungulate.model';
import { Country } from '../../../Shared/Models/location.model';
import { constant } from '../../../app.constants';

@Component({
  selector: 'app-create-ungulate',
  templateUrl: './create-ungulate.component.html',
  styleUrls: ['./create-ungulate.component.css']
})

export class CreateUngulateComponent implements OnInit {

  ungulateForm: FormGroup;

  ungulateRaceList: Array<any> = [];
  ungulateHolderList: Array<any> = [];
  ungulateOwnerList: Array<any> = [];
  ungulatePurposeList: Array<any> = [];

  countryList: Array<Country> = [];

  loading: boolean = false;
  mode: 'create' | 'edit' = 'create';
  editId: string = null;
  inputData: any;
  modalRef: NgbModalRef;
  assetsURL = constant.assetsURL;


  ungulateImages: Array<File> = [];
  ungulateImagesPreview: Array<string> = [];
  imageFiles: Array<File> = null;
  selectedUngulate: Ungulate = null;
  ungulateList: Array<Ungulate> = [];
  ungulateImageForm: FormGroup;
  uploadLoader: boolean = false;

  constructor(
    private dataservice: DataService,
    private modal: ModalService,
    private utility: UtilityService,
    private route: ActivatedRoute
  ) {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.mode = 'edit';
      try {
        this.inputData = JSON.parse(localStorage.getItem('editUngulateData'));
        console.log(this.inputData);
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  async ngOnInit() {
    this.createOrResetForm(this.mode === 'edit' ? this.inputData : null);
    this.createOrResetUngulateImageForm(this.mode === 'edit' ? this.inputData : null);
    this.getUngulateRaceList();
    this.getUngulateList();
    this.getUngulateHolderList();
    this.getUngulateOwnerList();
    this.getUngulatePurposeList();
    this.getCountries();
    if (this.mode === 'edit') {
    }
  }

  createOrResetForm(data: Ungulate = null) {
    this.ungulateForm = new FormGroup({
      microchipId: new FormControl(data?.microchipId ?? '', [Validators.required]),
      microchippingDate: new FormControl(data?.microchippingDate ?? '', [Validators.required]),
      ueln: new FormControl(data?.ueln ?? ''),
      name: new FormControl(data?.name ?? '', [Validators.required]),
      motherName: new FormControl(data?.motherName ?? ''),
      motherMicrochipId: new FormControl(data?.motherMicrochipId ?? ''),
      fatherName: new FormControl(data?.fatherName ?? ''),
      fatherMicrochipId: new FormControl(data?.fatherMicrochipId ?? ''),
      countryOfBirth: new FormControl(data?.countryOfBirth ?? '', [Validators.required]),
      countryOfOrigin: new FormControl(data?.countryOfOrigin ?? ''),
      dateOfBirth: new FormControl(data?.dateOfBirth ?? '', [Validators.required]),
      ungulateRace: new FormControl(data?.ungulateRace ?? '', [Validators.required]),
      ungulateHolder: new FormControl(data?.ungulateHolder ?? '', [Validators.required]),
      ungulateOwner: new FormControl(data?.ungulateOwner ?? '', [Validators.required]),
      ungulatePurpose: new FormControl(data?.ungulatePurpose ?? '', [Validators.required]),
      hairColorAndLabel: new FormControl(data?.hairColorAndLabel ?? '', [Validators.required]),
      sex: new FormControl(data?.sex ?? 'M', [Validators.required]),
      foodChain: new FormControl(data?.foodChain ?? true, [Validators.required]),
      feiNumber: new FormControl(data?.feiNumber ?? ''),
      feiName: new FormControl(data?.feiName ?? ''),
      passport: new FormControl(data?.passport ?? ''),
      passportCountry: new FormControl(data?.passportCountry ?? ''),
      passportIssuedBy: new FormControl(data?.passportIssuedBy ?? ''),
      passportDate: new FormControl(data?.passportDate ?? '', [Validators.required]),
      veterinarianId: new FormControl(data?.veterinarianId ?? '', [Validators.required]),
      ungulateImages: new FormControl(data?.ungulateImages ?? [], [Validators.required]),
      active: new FormControl(data?.active !== undefined && data?.active != null ? data?.active : true)
    });
  }

  createOrResetUngulateImageForm(data: Ungulate = null) {
    this.ungulateImageForm = new FormGroup({
      ungulate: new FormControl(data ?? '', [Validators.required])
    });
  }

  createOrUpdateData() {
    this.utility.forEachContorl(this.ungulateForm, (control: FormControl) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.ungulateForm.valid) {
      if (this.mode === 'edit') {
        this.ungulateForm.disable();
        this.loading = true;
        const requestData = { ...this.ungulateForm.value };
        // requestData['microchippingDate'] = requestData.microchippingDate;
        // requestData['sex'] = requestData.sex;
        // delete requestData.microchippingDate;
        // delete requestData.sex;
        delete requestData.active;
        this.dataservice.PUT(this.utility.parseDataIntoUrl(ENDPOINTS.UNGULATE.MODIFY, { id: this.editId }), requestData)
          .then((result) => {
            this.ungulateForm.enable();
            this.inputData = result.content;
            // this.resetUpdateMode();
            // this.modal.showSuccess("Updated Successfully", 3000)
            this.modal.showSuccess('Операција извршена', 3000);
            this.loading = false;
          }, (error) => {
            console.log('error', error);
            this.ungulateForm.enable();
            this.loading = false;
          });
      } else {
        this.ungulateForm.disable();
        this.loading = true;
        this.dataservice.POST(ENDPOINTS.UNGULATE.CREATE, this.ungulateForm.value).then((result) => {
          this.ungulateForm.enable();
          this.createOrResetForm();
          this.loading = false;
        }, (error) => {
          console.log('error', error);
          this.ungulateForm.enable();
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

  getCountries() {
    this.dataservice.GET(ENDPOINTS.EXTRA_SERVICES.GETCOUNTRIES).then(countries => {
      this.countryList = countries.content;
    }, error => {
      console.log('error', error);
    });
  }

  getUngulateRaceList() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.UNGULATE_RACE.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulateRace => {
        this.ungulateRaceList = ungulateRace.content;
      }).catch(error => {
        console.log('error', error);
      });
  }

  getUngulateHolderList() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.UNGULATE_HOLDER.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulateHolder => {
        this.ungulateHolderList = ungulateHolder.content;
      }).catch(error => {
        console.log('error', error);
      });
  }

  getUngulateOwnerList() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.UNGULATE_OWNER.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulateOwner => {
        this.ungulateOwnerList = ungulateOwner.content;
      }).catch(error => {
        console.log('error', error);
      });
  }

  getUngulatePurposeList() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.UNGULATE_PURPOSE.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulatePurpose => {
        this.ungulatePurposeList = ungulatePurpose.content;
      }).catch(error => {
        console.log('error', error);
      });
  }

  getUngulateList() {
    const qs = { pageNumber: 0, pageSize: 1000 };
    this.dataservice.GET(`${ENDPOINTS.UNGULATE.RETRIEVE_ALL}?${queryString.stringify(qs)}`)
      .then(ungulate => {
        this.ungulateList = ungulate.content;
      }).catch(error => {
        console.log('error', error);
      });
  }

  compareObjectById(first, second) {
    return first && second && first.id === second.id;
  }

  async handleFileInputChange(event) {
    this.imageFiles = event.target.files;
    console.log(this.imageFiles)
    for (let i = 0; i < this.imageFiles.length; i++) {
      this.ungulateImages.push(this.imageFiles[i]);
      const base64 = await this.utility.toBase64(this.imageFiles[i]);
      this.ungulateImagesPreview.push(base64);
    }
  }

  removeFileFromList(i) {
    console.log("remvoe from list");
    this.ungulateImages.splice(i, 1);
    this.ungulateImagesPreview.splice(i, 1);
  }

  createOrUpdateUngulateImages() {
    this.utility.forEachContorl(this.ungulateImageForm, (control) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    })
    if (this.ungulateImageForm.valid && this.ungulateImages.length > 0) {
      const formData = new FormData();
      this.uploadLoader = true;
      formData.append("ungulateId", JSON.stringify(this.ungulateImageForm.value.ungulate.id))
      this.ungulateImages.forEach((file: File) => {
        const extension = file.name.substring(file.name.lastIndexOf("."));
        const name = this.utility.generateRandomName(25) + extension;
        formData.append("images", file, name);
      })
      this.dataservice.POST(ENDPOINTS.UNGULATE.UPLOAD_IMAGES, formData).then(result => {
        this.uploadLoader = false;
        if (this.mode == 'edit') {
          this.imageFiles = null;
          this.ungulateImages = [];
          this.inputData.ungulateImages = this.inputData.ungulateImages.concat(result.content.ungulateImages);
        } else {
          this.imageFiles = null;
          this.ungulateImages = [];
          this.createOrResetUngulateImageForm();
        }
      }, error => {
        console.log("error", error);
        this.uploadLoader = false;
      })
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.resetUpdateMode();
    localStorage.removeItem('editHolderData');
  }



}
