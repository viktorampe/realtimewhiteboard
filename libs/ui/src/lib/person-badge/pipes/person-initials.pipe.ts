import { Pipe, PipeTransform } from '@angular/core';
import { BadgePersonInterface } from '../person-badge.component';

@Pipe({
  name: 'personInitials'
})
export class PersonInitialsPipe implements PipeTransform {
  transform(person: BadgePersonInterface, args?: any): any {
    if (!person.avatar) {
      return (
        person.name.charAt(0).toUpperCase() +
        person.firstName.charAt(0).toUpperCase()
      );
    }
    return '';
  }
}
