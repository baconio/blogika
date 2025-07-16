/**
 * Тесты для Button компонента
 * Следует принципам микромодульности - тестирование единственной ответственности
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { ButtonProps } from './Button.types';

// Мок для аналитики
const mockAnalytics = jest.fn();

// Базовые пропсы для тестирования
const defaultProps: Partial<ButtonProps> = {
  children: 'Test Button',
};

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders button with text', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('renders with default variant and size', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
    });

    it('applies custom className', () => {
      render(<Button {...defaultProps} className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants and Sizes', () => {
    it('renders different variants correctly', () => {
      const { rerender } = render(<Button variant="secondary">{defaultProps.children}</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-secondary');

      rerender(<Button variant="outline">{defaultProps.children}</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-outline');

      rerender(<Button variant="ghost">{defaultProps.children}</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-ghost');
    });

    it('renders different sizes correctly', () => {
      const { rerender } = render(<Button size="xs">{defaultProps.children}</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-xs');

      rerender(<Button size="lg">{defaultProps.children}</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button {...defaultProps} isDisabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('btn-disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles loading state', () => {
      render(<Button {...defaultProps} isLoading />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    it('handles loading with custom text', () => {
      render(<Button {...defaultProps} isLoading loadingText="Сохранение..." />);
      expect(screen.getByText('Сохранение...')).toBeInTheDocument();
    });

    it('applies state classes correctly', () => {
      const { rerender } = render(<Button {...defaultProps} isActive />);
      expect(screen.getByRole('button')).toHaveClass('btn-active');

      rerender(<Button {...defaultProps} isWide />);
      expect(screen.getByRole('button')).toHaveClass('btn-wide');

      rerender(<Button {...defaultProps} isBlock />);
      expect(screen.getByRole('button')).toHaveClass('btn-block');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('renders left icon', () => {
      render(
        <Button {...defaultProps} leftIcon={<TestIcon />}>
          {defaultProps.children}
        </Button>
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(
        <Button {...defaultProps} rightIcon={<TestIcon />}>
          {defaultProps.children}
        </Button>
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('hides icons during loading', () => {
      render(
        <Button 
          {...defaultProps} 
          leftIcon={<TestIcon />}
          rightIcon={<TestIcon />}
          isLoading 
        />
      );
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('calls onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents click when disabled', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} isDisabled />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents click when loading', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} isLoading />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Analytics', () => {
    // Мок console.log для проверки аналитики
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    afterEach(() => {
      consoleSpy.mockClear();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('logs analytics on click', () => {
      const analytics = {
        event: 'test_click',
        category: 'test_category',
        label: 'test_label',
      };

      render(
        <Button {...defaultProps} analytics={analytics} />
      );
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Button Analytics:',
        expect.objectContaining({
          ...analytics,
          variant: 'primary',
          size: 'md',
          timestamp: expect.any(Number),
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'false');
      expect(button).toHaveAttribute('aria-busy', 'false');
    });

    it('updates ARIA attributes based on state', () => {
      const { rerender } = render(<Button {...defaultProps} isLoading />);
      let button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');

      rerender(<Button {...defaultProps} isDisabled />);
      button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-busy', 'false');
    });

    it('provides screen reader text for loading state', () => {
      render(<Button {...defaultProps} isLoading loadingPosition="replace" />);
      expect(screen.getByText('Загрузка...')).toHaveClass('sr-only');
    });
  });

  describe('Loading Positions', () => {
    it('shows spinner at start position', () => {
      render(
        <Button {...defaultProps} isLoading loadingPosition="start" />
      );
      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('shows spinner at end position', () => {
      render(
        <Button {...defaultProps} isLoading loadingPosition="end" />
      );
      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('replaces content with spinner', () => {
      render(
        <Button {...defaultProps} isLoading loadingPosition="replace" />
      );
      expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
      expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
    });
  });
}); 