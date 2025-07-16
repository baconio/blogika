/**
 * Тесты для LoadingSpinner компонента
 * Проверяет спиннеры, скелетоны и прогресс-бары
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, Skeleton, ProgressBar } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner with default props', () => {
    render(<LoadingSpinner />);
    
    expect(document.querySelector('.loading')).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(document.querySelector('.loading-sm')).toBeInTheDocument();
    
    rerender(<LoadingSpinner size="lg" />);
    expect(document.querySelector('.loading-lg')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />);
    expect(document.querySelector('.text-primary')).toBeInTheDocument();
    
    rerender(<LoadingSpinner variant="error" />);
    expect(document.querySelector('.text-error')).toBeInTheDocument();
  });

  it('applies type classes correctly', () => {
    const { rerender } = render(<LoadingSpinner type="dots" />);
    expect(document.querySelector('.loading-dots')).toBeInTheDocument();
    
    rerender(<LoadingSpinner type="ring" />);
    expect(document.querySelector('.loading-ring')).toBeInTheDocument();
  });

  it('shows text when provided', () => {
    render(<LoadingSpinner text="Loading data..." showText />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('shows default text when showText is true', () => {
    render(<LoadingSpinner showText />);
    
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('positions text correctly', () => {
    const { rerender } = render(
      <LoadingSpinner text="Loading..." showText textPosition="bottom" />
    );
    expect(document.querySelector('.flex-col')).toBeInTheDocument();
    
    rerender(
      <LoadingSpinner text="Loading..." showText textPosition="right" />
    );
    expect(document.querySelector('.flex-row')).toBeInTheDocument();
  });

  it('applies fullScreen classes when enabled', () => {
    render(<LoadingSpinner fullScreen />);
    
    expect(document.querySelector('.fixed')).toBeInTheDocument();
    expect(document.querySelector('.inset-0')).toBeInTheDocument();
  });

  it('applies overlay classes when enabled', () => {
    render(<LoadingSpinner overlay />);
    
    expect(document.querySelector('.bg-base-100\\/80')).toBeInTheDocument();
    expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />);
    
    expect(document.querySelector('.custom-spinner')).toBeInTheDocument();
  });

  it('applies aria-label correctly', () => {
    render(<LoadingSpinner ariaLabel="Custom loading" />);
    
    expect(screen.getByLabelText('Custom loading')).toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('renders skeleton with default props', () => {
    render(<Skeleton />);
    
    expect(document.querySelector('.bg-base-300')).toBeInTheDocument();
  });

  it('applies custom width and height', () => {
    render(<Skeleton width="200px" height="50px" />);
    
    const skeleton = document.querySelector('.bg-base-300');
    expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
  });

  it('applies shape classes correctly', () => {
    const { rerender } = render(<Skeleton shape="circle" />);
    expect(document.querySelector('.rounded-full')).toBeInTheDocument();
    
    rerender(<Skeleton shape="rectangle" />);
    expect(document.querySelector('.rounded')).toBeInTheDocument();
  });

  it('renders multiple lines for text shape', () => {
    render(<Skeleton shape="text" lines={3} />);
    
    expect(document.querySelectorAll('.bg-base-300')).toHaveLength(3);
  });

  it('applies animation when enabled', () => {
    render(<Skeleton animate />);
    
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('does not apply animation when disabled', () => {
    render(<Skeleton animate={false} />);
    
    expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-skeleton" />);
    
    expect(document.querySelector('.custom-skeleton')).toBeInTheDocument();
  });

  it('makes last line shorter for text skeleton', () => {
    render(<Skeleton shape="text" lines={2} width="100%" />);
    
    const skeletons = document.querySelectorAll('.bg-base-300');
    const lastSkeleton = skeletons[skeletons.length - 1];
    expect(lastSkeleton).toHaveStyle({ width: '75%' });
  });
});

describe('ProgressBar', () => {
  it('renders progress bar with value', () => {
    render(<ProgressBar value={50} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('value', '50');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('applies custom max value', () => {
    render(<ProgressBar value={75} max={150} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('max', '150');
  });

  it('shows percentage when enabled', () => {
    render(<ProgressBar value={75} showPercent />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows custom text', () => {
    render(<ProgressBar value={25} text="Uploading files..." />);
    
    expect(screen.getByText('Uploading files...')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<ProgressBar value={50} size="sm" />);
    expect(document.querySelector('.progress-sm')).toBeInTheDocument();
    
    rerender(<ProgressBar value={50} size="lg" />);
    expect(document.querySelector('.progress-lg')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<ProgressBar value={50} variant="success" />);
    
    expect(document.querySelector('.text-success')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ProgressBar value={50} className="custom-progress" />);
    
    expect(document.querySelector('.custom-progress')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(<ProgressBar value={30} max={150} showPercent />);
    
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('applies aria attributes correctly', () => {
    render(<ProgressBar value={60} ariaLabel="Upload progress" />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-label', 'Upload progress');
    expect(progress).toHaveAttribute('aria-valuenow', '60');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps value between 0 and max', () => {
    const { rerender } = render(<ProgressBar value={-10} showPercent />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    rerender(<ProgressBar value={150} max={100} showPercent />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
}); 