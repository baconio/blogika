/**
 * Тесты для Modal компонента
 * Проверяет функциональность модального окна
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal, ModalFooter } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: 'Modal content'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /закрыть модал/i });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const modal = document.querySelector('.modal');
    fireEvent.click(modal!);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when backdrop clicked if closeOnBackdrop is false', () => {
    render(<Modal {...defaultProps} closeOnBackdrop={false} />);
    
    const modal = document.querySelector('.modal');
    fireEvent.click(modal!);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(document.querySelector('.w-80')).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} size="lg" />);
    expect(document.querySelector('.w-\\[32rem\\]')).toBeInTheDocument();
  });

  it('renders without title when not provided', () => {
    const { title, ...propsWithoutTitle } = defaultProps;
    render(<Modal {...propsWithoutTitle} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
});

describe('ModalFooter', () => {
  it('renders footer content', () => {
    render(
      <ModalFooter>
        <button>Save</button>
        <button>Cancel</button>
      </ModalFooter>
    );
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ModalFooter className="custom-footer">
        <button>Save</button>
      </ModalFooter>
    );
    
    expect(document.querySelector('.custom-footer')).toBeInTheDocument();
  });
}); 