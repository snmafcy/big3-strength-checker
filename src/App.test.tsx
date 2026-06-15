import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('初回（未設定）は案内文を表示し、ハイライト行はない', () => {
    render(<App />);
    expect(screen.getByText(/設定から性別・体重を入力すると/)).toBeInTheDocument();
    expect(screen.queryByTestId('highlight-row')).not.toBeInTheDocument();
  });

  it('種目を切り替えるとヘッダ表示が変わる', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('ベンチ・男性')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'スクワット' }));
    expect(screen.getByText('スクワット・男性')).toBeInTheDocument();
  });

  it('設定で男性・70kg を保存するとサマリーとハイライト行が出る', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '70');
    await user.click(screen.getByRole('button', { name: '保存' }));

    const summary = screen.getByText(/あなた\(/).closest('section')!;
    // 70kg の intermediate 80.3125 → 0.5刻みで 80.5、常に小数1桁表示
    expect(within(summary).getByText('80.5')).toBeInTheDocument();
    expect(screen.getByTestId('highlight-row')).toBeInTheDocument();
  });

  it('範囲外の体重では範囲外チップを表示する', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '200');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByText('範囲外')).toBeInTheDocument();
  });

  it('不正な体重（10kg）は保存されずエラーを表示する', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '10');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByRole('alert')).toHaveTextContent('30');
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });
});
