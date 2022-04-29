/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobResponceComponent } from './JobResponce.component';

describe('JobResponceComponent', () => {
  let component: JobResponceComponent;
  let fixture: ComponentFixture<JobResponceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobResponceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobResponceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
