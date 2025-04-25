import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccountForm from '@/components/CreateAccountForm';
import fetchMock from 'jest-fetch-mock'; // Import fetchMock

describe('CreateAccountForm', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetchMock.resetMocks();
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

  it('submits the form, calls the API, and shows success message on successful creation', async () => {
    // Mock a successful API response
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Account created successfully!' }), { status: 201 });

    const user = userEvent.setup();
    render(<CreateAccountForm />);
    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    const testUsername = 'new_unique_user';
    const testPassword = 'newpassword123';

    await user.type(usernameInput, testUsername);
    await user.type(passwordInput, testPassword);
    await user.type(repeatPasswordInput, testPassword);
    await user.click(submitButton);

    // Check that fetch was called correctly
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: testUsername, password: testPassword }),
      });
    });

    // Check for the success message displayed by the component
    expect(await screen.findByText(/Account created successfully!/i)).toBeInTheDocument();
  });

  it('shows an error message if username already exists', async () => {
    // Mock an API response indicating the user already exists
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Username already exists' }), { status: 409 });

    const user = userEvent.setup();
    const existingUsername = 'existinguser'; // No need to pre-create via fetch

    render(<CreateAccountForm />);
    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, existingUsername);
    await user.type(passwordInput, 'password');
    await user.type(repeatPasswordInput, 'password');
    await user.click(submitButton);

    // Check that fetch was called correctly
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: existingUsername, password: 'password' }),
      });
    });

    // Check for the error message displayed by the component
    expect(await screen.findByText(/Username already exists/i)).toBeInTheDocument();
  });

  it('shows a specific error message on API failures when provided', async () => {
    // Mock a generic server error with a specific message
    const specificError = 'Internal Server Error';
    fetchMock.mockResponseOnce(JSON.stringify({ error: specificError }), { status: 500 });

    const user = userEvent.setup();
    render(<CreateAccountForm />);
    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'someuser');
    await user.type(passwordInput, 'somepassword');
    await user.type(repeatPasswordInput, 'somepassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check for the specific error message from the API response
    expect(await screen.findByText(specificError)).toBeInTheDocument();
  });

  it('shows a fallback error message on API failures without specific message', async () => {
    // Mock a server error without a specific error message in the body
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    const user = userEvent.setup();
    render(<CreateAccountForm />);
    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'anotheruser');
    await user.type(passwordInput, 'anotherpassword');
    await user.type(repeatPasswordInput, 'anotherpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check for the component's fallback error message
    expect(await screen.findByText(/Failed to create account/i)).toBeInTheDocument();
  });

  it('shows a generic error message on network failure', async () => {
    // Mock a network error
    fetchMock.mockRejectOnce(new Error('Network failure'));

    // --- Silence console.error ---
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // -----------------------------

    const user = userEvent.setup();
    render(<CreateAccountForm />);
    const usernameInput = screen.getByLabelText(/^Username$/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const repeatPasswordInput = screen.getByLabelText(/Repeat Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(usernameInput, 'networkuser');
    await user.type(passwordInput, 'networkpassword');
    await user.type(repeatPasswordInput, 'networkpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check for the generic catch block error message
    expect(await screen.findByText(/An unexpected error occurred. Please try again./i)).toBeInTheDocument();

    // --- Restore console.error ---
    errorSpy.mockRestore();
    // ---------------------------
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
    expect(fetchMock).not.toHaveBeenCalled(); // Verify fetch was not called
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
    expect(fetchMock).not.toHaveBeenCalled(); // Verify fetch was not called
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
    expect(fetchMock).not.toHaveBeenCalled(); // Verify fetch was not called
  });
});
