import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccountForm from '@/components/CreateAccountForm';

// Mock the fetch function
global.fetch = jest.fn();

describe('CreateAccountForm', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it('renders the form correctly', () => {
    render(<CreateAccountForm />);

    expect(screen.getByLabelText(/^Username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('allows user to type into username and password fields', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.type(repeatPasswordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
    expect(repeatPasswordInput).toHaveValue('password123');
  });

  it('submits the form and calls the create API on successful submission', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    // Mock a successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Account created successfully' }),
    });

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'newuser');
    await user.type(passwordInput, 'newpassword');
    await user.type(repeatPasswordInput, 'newpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'newuser', password: 'newpassword' }),
      });
    });

    // Optionally, check for a success message or navigation if implemented
    // For example, if a success message appears:
    // expect(await screen.findByText(/Account created successfully/i)).toBeInTheDocument();
  });

  it('shows an error message if API call fails', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    // Mock a failed API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Username already exists' }),
    });

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'existinguser');
    await user.type(passwordInput, 'password');
    await user.type(repeatPasswordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Check for an error message displayed to the user
    expect(await screen.findByText(/Username already exists/i)).toBeInTheDocument();
  });

  it('shows an error message if username is too short', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'usr'); // Too short
    await user.type(passwordInput, 'password123');
    await user.type(repeatPasswordInput, 'password123');
    await user.click(submitButton);

    expect(await screen.findByText(/Username must be at least 4 characters long/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows an error message if password is too short', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'pass'); // Too short
    await user.type(repeatPasswordInput, 'pass');
    await user.click(submitButton);

    expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows an error message if passwords do not match', async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.type(repeatPasswordInput, 'password456'); // Mismatch
    await user.click(submitButton);

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
