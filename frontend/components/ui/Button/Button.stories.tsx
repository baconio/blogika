/**
 * Storybook stories для Button компонента
 * @description Документация и примеры использования кнопки
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Универсальный компонент кнопки с различными вариантами и размерами. Поддерживает состояние загрузки и accessibility.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Визуальный стиль кнопки'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Размер кнопки'
    },
    isLoading: {
      control: 'boolean',
      description: 'Показать состояние загрузки'
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить кнопку'
    },
    children: {
      control: 'text',
      description: 'Текст кнопки'
    }
  },
  args: {
    children: 'Кнопка'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Основные варианты
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Основная кнопка'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: 'Вторичная кнопка'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Контурная кнопка'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Прозрачная кнопка'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Опасная кнопка'
  }
};

// Размеры
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Маленькая'
  }
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Средняя'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Большая'
  }
};

// Состояния
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Загрузка...'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Отключена'
  }
};

// Все размеры в ряд
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Маленькая</Button>
      <Button size="md">Средняя</Button>
      <Button size="lg">Большая</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Сравнение всех доступных размеров кнопок'
      }
    }
  }
};

// Все варианты в ряд
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Все доступные варианты стилизации кнопок'
      }
    }
  }
};

// Интерактивный пример
export const Interactive: Story = {
  args: {
    onClick: () => alert('Кнопка нажата!'),
    children: 'Нажми меня'
  },
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная кнопка с обработчиком клика'
      }
    }
  }
}; 