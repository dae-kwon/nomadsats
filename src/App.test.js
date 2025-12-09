import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // "Live" is part of the footer text: "Live • Dec 09, 2025..."
  const linkElement = screen.getByText(/Live/i);
  expect(linkElement).toBeInTheDocument();
});


