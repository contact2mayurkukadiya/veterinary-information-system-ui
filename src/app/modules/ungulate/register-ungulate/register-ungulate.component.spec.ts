import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RegisterUngulateComponent} from './register-ungulate.component';

describe('RegisterUngulateComponent', () => {
  let component: RegisterUngulateComponent;
  let fixture: ComponentFixture<RegisterUngulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterUngulateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUngulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
