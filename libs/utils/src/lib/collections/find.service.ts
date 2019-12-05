export function findOneInArray<T>(entities: T[], props: Partial<T>) {
  return entities.find(entity => {
    return Object.keys(props).every(
      prop => !props[prop] || entity[prop] === props[prop]
    );
  });
}

export function findManyInArray<T>(entities: T[], props: Partial<T>) {
  return entities.filter(entity => {
    return Object.keys(props).every(
      prop => !props[prop] || entity[prop] === props[prop]
    );
  });
}
