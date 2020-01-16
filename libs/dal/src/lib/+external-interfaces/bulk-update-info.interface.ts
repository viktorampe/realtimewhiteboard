/**
 * @typeparam T Succeeded updates of type `T`
 * @typeparam Y Failed updates return errors of type `Y`
 */
export interface BulkUpdateInfoInterface<T, Y> {
  succeeded: Partial<T>[];
  errors: Y[];
}
