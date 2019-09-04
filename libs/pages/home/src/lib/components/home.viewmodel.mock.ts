import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { HomeViewModel } from './home.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockHomeViewModel implements ViewModelInterface<HomeViewModel> {}
