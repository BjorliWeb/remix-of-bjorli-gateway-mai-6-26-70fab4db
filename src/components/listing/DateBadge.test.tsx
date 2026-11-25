import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DateBadge from './DateBadge';

describe('DateBadge', () => {
  it('keeps a Bjorli calendar date on the same day for visitors outside Norway', () => {
    const { container } = render(<DateBadge date="2026-11-28" locale="no" />);
    expect(container.querySelector('time')).toHaveTextContent('28. nov. 2026');
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-11-28');
  });

  it('uses the Oslo date for a timestamp across midnight', () => {
    const { container } = render(<DateBadge date="2026-11-27T23:30:00Z" locale="en" />);
    expect(container.querySelector('time')).toHaveTextContent('Nov 28, 2026');
  });

  it('preserves editorial date ranges', () => {
    const { container } = render(<DateBadge date="5.–6. september 2026" />);
    expect(container.querySelector('time')).toHaveTextContent('5.–6. september 2026');
  });
});
