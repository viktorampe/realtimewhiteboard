import { Pipe, PipeTransform } from '@angular/core';
import { PassportUserCredentialInterface } from '@campus/dal';

@Pipe({
  name: 'MailToByCredential'
})
export class MailToByCredentialPipe implements PipeTransform {
  /**
   * takes a UserCredentials object
   * returns a BadgePerson object
   *
   * @param {PassportUserCredentialInterface} credential
   * @returns {string}
   * @memberof MailToByCredentialPipe
   */
  transform(credential: PassportUserCredentialInterface): string {
    if (
      credential &&
      credential.profile &&
      Array.isArray(credential.profile.emails) &&
      credential.profile.emails.length
    ) {
      return 'mailto:' + credential.profile.emails[0].value;
    } else {
      return '';
    }
  }
}
