export enum SettingsPermissions {
  UPDATE_PROFILE = 'updateProfile',
  UPDATE_AVATAR = 'updateAvatar',
  ADD_CREDENTIALS = 'addCredentials',
  REMOVE_CREDENTIALS = 'removeCredentials',
  ADD_LICENSES = 'addLicenses',
  REMOVE_LICENSES = 'removeLicenses',
  ADD_SCHOOLS = 'addSchools',
  REMOVE_SCHOOLS = 'removeSchools',
  LINK_TEACHERS = 'linkTeachers',
  UNLINK_TEACHERS = 'unlinkTeachers',
  MANAGE_HISTORY = 'manageHistory'
}

export const Permissions = {
  settings: SettingsPermissions
};
