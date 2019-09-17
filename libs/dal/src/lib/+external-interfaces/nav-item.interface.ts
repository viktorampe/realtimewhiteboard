export interface NavItem {
  title: string;
  icon?: string;
  link?: any[] | string;
  children?: NavItem[];
  expanded?: boolean;
  requiredPermissions?: (string | string[])[];
}
