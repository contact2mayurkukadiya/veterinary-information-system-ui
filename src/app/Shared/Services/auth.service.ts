import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() { }

  getCurrentUser() {
    return this.currentUser$.getValue();
  }

  setCurrentUser(data) {
    this.currentUser$.next(data);
  }
}
