/**
 * Тесты для Badge компонента
 * Проверяет функциональность бейджей и их специализированных версий
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge, TagBadge, CategoryBadge } from './Badge';

describe('Badge', () => {
  it('renders badge content', () => {
    render(<Badge>Test Badge</Badge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(document.querySelector('.badge-primary')).toBeInTheDocument();
    
    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(document.querySelector('.badge-secondary')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(document.querySelector('.badge-sm')).toBeInTheDocument();
    
    rerender(<Badge size="lg">Large</Badge>);
    expect(document.querySelector('.badge-lg')).toBeInTheDocument();
  });

  it('handles click when clickable', () => {
    const handleClick = jest.fn();
    render(
      <Badge clickable onClick={handleClick}>
        Clickable Badge
      </Badge>
    );
    
    const badge = screen.getByRole('button');
    fireEvent.click(badge);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click when not clickable', () => {
    render(<Badge>Non-clickable Badge</Badge>);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles remove when removable', () => {
    const handleRemove = jest.fn();
    render(
      <Badge removable onRemove={handleRemove}>
        Removable Badge
      </Badge>
    );
    
    const removeButton = screen.getByRole('button', { name: /удалить бейдж/i });
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    
    expect(document.querySelector('.custom-badge')).toBeInTheDocument();
  });

  it('applies aria-label when provided', () => {
    render(<Badge ariaLabel="Custom label">Badge</Badge>);
    
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });
});

describe('TagBadge', () => {
  it('renders tag name', () => {
    render(<TagBadge tag="React" />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders tag with count', () => {
    render(<TagBadge tag="JavaScript" count={42} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('uses outline variant by default', () => {
    render(<TagBadge tag="TypeScript" />);
    
    expect(document.querySelector('.badge-outline')).toBeInTheDocument();
  });

  it('allows custom variant', () => {
    render(<TagBadge tag="Vue" variant="primary" />);
    
    expect(document.querySelector('.badge-primary')).toBeInTheDocument();
  });
});

describe('CategoryBadge', () => {
  it('renders category name', () => {
    render(<CategoryBadge category="Frontend" />);
    
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('applies custom color when provided', () => {
    render(<CategoryBadge category="Backend" color="#ff6b6b" />);
    
    const badge = screen.getByText('Backend').closest('span');
    expect(badge).toHaveStyle({
      backgroundColor: '#ff6b6b',
      borderColor: '#ff6b6b',
      color: 'white'
    });
  });

  it('uses primary variant by default', () => {
    render(<CategoryBadge category="Design" />);
    
    expect(document.querySelector('.badge-primary')).toBeInTheDocument();
  });

  it('applies font-medium class', () => {
    render(<CategoryBadge category="DevOps" />);
    
    expect(document.querySelector('.font-medium')).toBeInTheDocument();
  });
}); 