import { TestBed } from '@angular/core/testing';

import { NgxMessageEditorService } from './ngx-message-editor.service';

describe('NgxMessageEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxMessageEditorService = TestBed.get(NgxMessageEditorService);
    expect(service).toBeTruthy();
  });
});
