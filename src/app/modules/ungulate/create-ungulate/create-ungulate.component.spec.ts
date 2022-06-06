import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateUngulateComponent} from './create-ungulate.component';

describe('CreateUngulateComponent', () => {
  let component: CreateUngulateComponent;
  let fixture: ComponentFixture<CreateUngulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUngulateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUngulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
