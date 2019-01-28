import { Pipe, PipeTransform } from '@angular/core';
import { PassportUserCredentialInterface } from '@campus/dal';
import { BadgePersonInterface } from '@campus/ui';

@Pipe({
  name: 'PersonBadgeFromCredential'
})
export class PersonBadgeFromCredentialPipe implements PipeTransform {
  /**
   * takes a UserCredentials object
   * returns a BadgePerson object
   *
   * @param {PassportUserCredentialInterface} value
   * @returns {BadgePersonInterface}``
   * @memberof PersonBadgeFromCredentialPipe
   */
  transform(credential: PassportUserCredentialInterface): BadgePersonInterface {
    const ob = {
      displayName: '',
      name: '',
      firstName: '',
      avatar: ''
    };
    if (credential && credential.profile && credential.profile.name) {
      ob.displayName = credential.profile.name.displayName;
      ob.name = credential.profile.name.familyName;
      ob.firstName = credential.profile.name.givenName;
      ob.avatar = credential.profile.avatar;
    }
    return ob;
  }
}
