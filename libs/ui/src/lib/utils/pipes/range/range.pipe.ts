import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(length: number, offset: number = 0): number[] {
    if (!length) {
      return [];
    }
    return Array.from(
      Array(length)
        .fill(offset)
        .map((off, index) => off + index)
    );
  }
}
