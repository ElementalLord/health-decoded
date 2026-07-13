export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type Pagination = {
  from: number;
  limit: number;
  to: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function positiveIntegerOrDefault(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

export function normalizePagination(input: PaginationInput = {}): Pagination {
  const page = positiveIntegerOrDefault(input.page, DEFAULT_PAGE);
  const pageSize = Math.min(
    positiveIntegerOrDefault(input.pageSize, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const from = (page - 1) * pageSize;

  return { from, limit: pageSize, to: from + pageSize - 1 };
}
