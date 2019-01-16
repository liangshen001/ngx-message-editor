import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMessageEditorComponent } from './ngx-message-editor.component';

describe('NgxMessageEditorComponent', () => {
  let component: NgxMessageEditorComponent;
  let fixture: ComponentFixture<NgxMessageEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMessageEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMessageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
