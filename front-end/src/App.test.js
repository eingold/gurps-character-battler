import { render, screen } from '@testing-library/react';
import App from './App';

test('renders a button', () => {
  render(<App />);
  const submitButton = screen.getAllByDisplayValue(/submit/i)[0];
  expect(submitButton).toBeInTheDocument();
});
