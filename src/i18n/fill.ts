/** Fill `{name}` placeholders in a dictionary string, e.g. 'Open lifts: {open} of {total}'. */
export const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
