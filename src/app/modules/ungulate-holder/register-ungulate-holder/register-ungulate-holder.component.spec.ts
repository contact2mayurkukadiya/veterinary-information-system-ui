import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterUngulateHolderComponent} from './register-ungulate-holder.component';

describe('RegisterUngulateHolderComponent', () => {
  let component: RegisterUngulateHolderComponent;
  let fixture: ComponentFixture<RegisterUngulateHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterUngulateHolderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUngulateHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
