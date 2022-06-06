import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FarmTypeViewComponent} from './farm-type-view.component';

describe('FarmTypeViewComponent', () => {
  let component: FarmTypeViewComponent;
  let fixture: ComponentFixture<FarmTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FarmTypeViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
