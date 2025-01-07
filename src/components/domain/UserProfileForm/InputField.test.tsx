import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom';
import { InputAsDate } from './InputField';

describe('InputAsDate Input Behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm();
    return (
      <ChakraProvider>
        <FormProvider {...methods}>{children}</FormProvider>
      </ChakraProvider>
    );
  };

  it('正しく入力値を変換できること', () => {
    render(
      <TestWrapper>
        <InputAsDate name="birthDate" placeholder="例：20240101" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('例：20240101');

    fireEvent.change(input, { target: { value: '20240101' } });
    expect(input).toHaveValue('2024年01月01日');

    fireEvent.focus(input);
    expect(input).toHaveValue('20240101');

    fireEvent.blur(input);
    expect(input).toHaveValue('2024年01月01日');
  });

  it('不完全な入力の場合は変換されないこと', () => {
    render(
      <TestWrapper>
        <InputAsDate name="birthDate" placeholder="例：20240101" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('例：20240101');
    fireEvent.change(input, { target: { value: '2024010' } });
    expect(input).toHaveValue('2024010');

    fireEvent.focus(input);
    expect(input).toHaveValue('2024010');

    fireEvent.blur(input);
    expect(input).toHaveValue('2024010');
  });

  it('数字以外の文字が除去されること', () => {
    render(
      <TestWrapper>
        <InputAsDate name="birthDate" placeholder="例：20240101" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('例：20240101');
    fireEvent.change(input, { target: { value: '2024abc01' } });
    expect(input).toHaveValue('202401');
  });

  it('空の入力値を正しく処理できること', () => {
    render(
      <TestWrapper>
        <InputAsDate name="birthDate" placeholder="例：20240101" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('例：20240101');
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');

    fireEvent.focus(input);
    expect(input).toHaveValue('');

    fireEvent.blur(input);
    expect(input).toHaveValue('');
  });
});

describe('InputAsDate Form Submit', () => {
  const TestForm = ({ onSubmit = vi.fn() }) => {
    const methods = useForm();

    return (
      <ChakraProvider>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <InputAsDate name="birthDate" placeholder="例：20240101" />
            <button type="submit">送信</button>
          </form>
        </FormProvider>
      </ChakraProvider>
    );
  };

  it('完全な日付でフォーム送信した場合、正しい値が送信されること', async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('例：20240101');
    const submitButton = screen.getByText('送信');

    // 日付を入力
    fireEvent.change(input, { target: { value: '20240101' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('2024年01月01日');

    // フォーム送信
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({ birthDate: '20240101' }, expect.anything());
    });
  });

  it('フォーカス中にフォーム送信した場合', async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('例：20240101');
    const submitButton = screen.getByText('送信');

    // 日付を入力してフォーカス
    fireEvent.change(input, { target: { value: '20240101' } });
    fireEvent.focus(input);
    expect(input).toHaveValue('20240101');

    // フォーカス中に送信
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ birthDate: '20240101' }, expect.anything());
    });
  });
});
