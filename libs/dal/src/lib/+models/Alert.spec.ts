import { Alert } from './Alert';

describe('Alert class', () => {
  it('should give the matching alert icon', () => {
    iconAssertion('educontent', 'educontent');
    iconAssertion('message', 'messages');
    iconAssertion('bundle', 'educontent');
    iconAssertion('task', 'task');
    iconAssertion('task-start', 'task');
    iconAssertion('task-end', 'task');
    iconAssertion('boek-e', 'book');
    iconAssertion('marketing', 'marketing-message');
    iconAssertion('', 'notifications');
  });
});

function iconAssertion(type: string, expectedIcon: string) {
  const alert = new Alert();
  alert.type = type;
  expect(alert.icon).toBe(expectedIcon);
}
