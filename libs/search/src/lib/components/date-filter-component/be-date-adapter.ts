import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class BeDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}
