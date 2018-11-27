import { Alert } from './Alert';

describe('Alert class', () => {
  it('should give the matching alert icon', () => {
    iconAssertion('educontent', 'educontent');
    iconAssertion('message', 'envelope-open');
    iconAssertion('bundle', 'educontent');
    iconAssertion('task', 'tasks');
    iconAssertion('task-start', 'tasks');
    iconAssertion('task-end', 'tasks');
    iconAssertion('boek-e', 'book');
    iconAssertion('marketing', 'polpo');
    iconAssertion('', 'notifications');
  });
});

function iconAssertion(type: string, expectedIcon: string) {
  const alert = new Alert();
  alert.type = type;
  expect(alert.icon).toBe(expectedIcon);
}
