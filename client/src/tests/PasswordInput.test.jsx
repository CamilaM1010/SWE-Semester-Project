import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PasswordInput from '../components/PasswordInput';  

describe('PasswordInput', () => {
  test('toggles input type when show/hide is clicked', () => {
   
    render(
      <PasswordInput id="testPassword" label="Password" value="" onChange={() => {}} placeholder="Enter password" />
    );

   
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

   
    const toggleButton = screen.getByText('Show');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

   
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});