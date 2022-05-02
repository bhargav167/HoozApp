/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobChatComponent } from './JobChat.component';

describe('JobChatComponent', () => {
  let component: JobChatComponent;
  let fixture: ComponentFixture<JobChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
