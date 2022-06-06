import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateUngulateHolderComponent} from './create-ungulate-holder.component';

describe('CreateUngulateHolderComponent', () => {
  let component: CreateUngulateHolderComponent;
  let fixture: ComponentFixture<CreateUngulateHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUngulateHolderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUngulateHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
