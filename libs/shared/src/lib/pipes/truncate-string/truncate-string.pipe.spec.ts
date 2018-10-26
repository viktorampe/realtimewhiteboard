import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateString'
})
export class TruncateStringPipe implements PipeTransform {
  transform(value: String, overflow: String, maxLength: number): String {
    if (value && value.length > maxLength) {
      value = value.slice(0, maxLength) + overflow;
    }
    return value;
  }
}
