import { Pipe, PipeTransform } from '@angular/core';
import { BadgePerson } from '../person-badge.component';

@Pipe({
  name: 'personInitials'
})
export class PersonInitialsPipe implements PipeTransform {

  transform(person: BadgePerson, args?: any): any {
    if (!person.avatar) {
      return person.name.charAt(0).toUpperCase() + person.firstName.charAt(0).toUpperCase();
    }
    return '';
  }

}
