/**
 * Тесты для Avatar компонента
 * Проверяет функциональность аватаров, fallback и группировки
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'John Doe'
  };

  it('renders avatar with image', () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', defaultProps.src);
    expect(img).toHaveAttribute('alt', defaultProps.alt);
  });

  it('shows fallback with initials when no src provided', () => {
    render(<Avatar alt="John Doe Smith" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows fallback on image error', async () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Avatar {...defaultProps} size="sm" />);
    expect(document.querySelector('.w-8')).toBeInTheDocument();
    
    rerender(<Avatar {...defaultProps} size="lg" />);
    expect(document.querySelector('.w-16')).toBeInTheDocument();
  });

  it('applies shape classes correctly', () => {
    const { rerender } = render(<Avatar {...defaultProps} shape="square" />);
    expect(document.querySelector('.rounded-none')).toBeInTheDocument();
    
    rerender(<Avatar {...defaultProps} shape="rounded" />);
    expect(document.querySelector('.rounded-lg')).toBeInTheDocument();
  });

  it('shows status indicator when enabled', () => {
    render(<Avatar {...defaultProps} status="online" showStatus />);
    
    expect(document.querySelector('.bg-success')).toBeInTheDocument();
  });

  it('handles click when clickable', () => {
    const handleClick = jest.fn();
    render(<Avatar {...defaultProps} clickable onClick={handleClick} />);
    
    const avatar = document.querySelector('.avatar');
    fireEvent.click(avatar!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when loading', () => {
    render(<Avatar {...defaultProps} />);
    
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('generates correct initials', () => {
    const { rerender } = render(<Avatar alt="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
    
    rerender(<Avatar alt="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    
    rerender(<Avatar alt="John Michael Doe" />);
    expect(screen.getByText('JM')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar {...defaultProps} className="custom-avatar" />);
    
    expect(document.querySelector('.custom-avatar')).toBeInTheDocument();
  });

  it('shows different status colors', () => {
    const { rerender } = render(
      <Avatar {...defaultProps} status="online" showStatus />
    );
    expect(document.querySelector('.bg-success')).toBeInTheDocument();
    
    rerender(<Avatar {...defaultProps} status="busy" showStatus />);
    expect(document.querySelector('.bg-error')).toBeInTheDocument();
    
    rerender(<Avatar {...defaultProps} status="away" showStatus />);
    expect(document.querySelector('.bg-warning')).toBeInTheDocument();
  });
});

describe('AvatarGroup', () => {
  const mockAvatars = [
    { src: 'https://example.com/avatar1.jpg', alt: 'User 1' },
    { src: 'https://example.com/avatar2.jpg', alt: 'User 2' },
    { src: 'https://example.com/avatar3.jpg', alt: 'User 3' },
    { src: 'https://example.com/avatar4.jpg', alt: 'User 4' },
    { src: 'https://example.com/avatar5.jpg', alt: 'User 5' },
    { src: 'https://example.com/avatar6.jpg', alt: 'User 6' }
  ];

  it('renders all avatars when under max limit', () => {
    render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} max={5} />);
    
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('renders max avatars plus remaining count when over limit', () => {
    render(<AvatarGroup avatars={mockAvatars} max={3} />);
    
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('applies size to all avatars in group', () => {
    render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} size="lg" />);
    
    expect(document.querySelectorAll('.w-16')).toHaveLength(2);
  });

  it('applies shape to all avatars in group', () => {
    render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} shape="square" />);
    
    expect(document.querySelectorAll('.rounded-none')).toHaveLength(2);
  });

  it('applies avatar-group class', () => {
    render(<AvatarGroup avatars={mockAvatars.slice(0, 2)} />);
    
    expect(document.querySelector('.avatar-group')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AvatarGroup 
        avatars={mockAvatars.slice(0, 2)} 
        className="custom-group" 
      />
    );
    
    expect(document.querySelector('.custom-group')).toBeInTheDocument();
  });
}); 