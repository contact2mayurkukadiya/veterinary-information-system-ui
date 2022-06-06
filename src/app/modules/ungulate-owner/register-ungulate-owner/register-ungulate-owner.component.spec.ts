import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUngulateOwnerComponent } from './register-ungulate-owner.component';

describe('RegisterUngulateOwnerComponent', () => {
  let component: RegisterUngulateOwnerComponent;
  let fixture: ComponentFixture<RegisterUngulateOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUngulateOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUngulateOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
