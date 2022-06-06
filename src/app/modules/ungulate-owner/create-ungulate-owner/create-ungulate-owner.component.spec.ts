import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUngulateOwnerComponent } from './create-ungulate-owner.component';

describe('CreateUngulateOwnerComponent', () => {
  let component: CreateUngulateOwnerComponent;
  let fixture: ComponentFixture<CreateUngulateOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUngulateOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUngulateOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
