import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  forEachContorl(formGroup: FormGroup | FormArray, callback: Function): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key] as FormControl | FormGroup | FormArray;
      if (control instanceof FormControl) {
        control['key'] = key;
        callback(control);
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.forEachContorl(control, callback);
      }
    });
  }

  isEmptyString(str) {
    str = str.trim();
    if (!str || str.length <= 0 || str == undefined || str == null) {
      return true;
    }
    return false;
  }

  isEmptyJSON(json) {
    if (Object.keys(json).length <= 0 || json == {}) {
      return true;
    }
    return false;
  }

  skipNullFields(obj: {}): {} {
    Object.keys(obj).forEach(k =>
      (obj[k] && typeof obj[k] === 'object') && this.skipNullFields(obj[k]) ||
      (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
  }

  parseDataIntoUrl(url: String, data = {}) {
    let newURL: string = JSON.parse(JSON.stringify(url));
    const keys = Object.keys(data);
    if (keys.length > 0) {
      keys.forEach(key => {
        if (newURL.includes(`{${key}}`) && key in data) {
          newURL = newURL.replace(`{${key}}`, data[key])
        }
      })
      return newURL;
    }
    return newURL;
  }

  toBase64(file: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => { resolve(reader.result) };
      reader.readAsDataURL(file);
      reader.onerror = error => reject(error);
    });
  }

  generateRandomName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}
