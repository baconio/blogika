/**
 * Storybook stories для Input компонента
 * @description Документация и примеры использования полей ввода
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Универсальный компонент поля ввода с поддержкой валидации, различных типов и состояний.'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Тип поля ввода'
    },
    placeholder: {
      control: 'text',
      description: 'Подсказка в поле ввода'
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить поле ввода'
    },
    error: {
      control: 'text',
      description: 'Текст ошибки валидации'
    },
    label: {
      control: 'text',
      description: 'Подпись к полю'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый пример
export const Default: Story = {
  args: {
    placeholder: 'Введите текст'
  }
};

// С подписью
export const WithLabel: Story = {
  render: (args) => (
    <div className="w-64">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Имя пользователя
      </label>
      <Input {...args} />
    </div>
  ),
  args: {
    placeholder: 'Введите имя'
  }
};

// Типы полей
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com'
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Введите пароль'
  }
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '123'
  }
};

export const Phone: Story = {
  args: {
    type: 'tel',
    placeholder: '+7 (999) 123-45-67'
  }
};

// Состояния
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Отключенное поле',
    value: 'Нельзя редактировать'
  }
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-64">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email адрес
      </label>
      <Input {...args} />
      {args.error && (
        <p className="mt-1 text-sm text-red-600">{args.error}</p>
      )}
    </div>
  ),
  args: {
    type: 'email',
    placeholder: 'email@example.com',
    error: 'Введите корректный email адрес',
    value: 'invalid-email'
  }
};

// Размеры
export const Small: Story = {
  args: {
    placeholder: 'Маленький размер',
    className: 'text-sm py-1 px-2'
  }
};

export const Large: Story = {
  args: {
    placeholder: 'Большой размер',
    className: 'text-lg py-3 px-4'
  }
};

// Форма регистрации (пример комплексного использования)
export const RegistrationForm: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Регистрация</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имя пользователя
        </label>
        <Input placeholder="username" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input type="email" placeholder="email@example.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Пароль
        </label>
        <Input type="password" placeholder="••••••••" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <Input type="tel" placeholder="+7 (999) 123-45-67" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Пример использования различных типов полей в форме регистрации'
      }
    }
  }
};

// Поиск (с иконкой)
export const SearchField: Story = {
  render: () => (
    <div className="relative w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input className="pl-10" placeholder="Поиск статей..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Поле поиска с иконкой'
      }
    }
  }
}; 