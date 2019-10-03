import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { EditorViewModel } from './editor.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockEditorViewModel
  implements ViewModelInterface<EditorViewModel> {}
