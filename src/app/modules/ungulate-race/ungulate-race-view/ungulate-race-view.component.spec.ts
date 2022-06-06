import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UngulateRaceViewComponent} from './ungulate-race-view.component';

describe('UngulateRaceViewComponent', () => {
  let component: UngulateRaceViewComponent;
  let fixture: ComponentFixture<UngulateRaceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UngulateRaceViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UngulateRaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
