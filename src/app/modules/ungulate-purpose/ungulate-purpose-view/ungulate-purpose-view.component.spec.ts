import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UngulatePurposeViewComponent} from './ungulate-purpose-view.component';

describe('UngulatePurposeViewComponent', () => {
  let component: UngulatePurposeViewComponent;
  let fixture: ComponentFixture<UngulatePurposeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UngulatePurposeViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UngulatePurposeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
