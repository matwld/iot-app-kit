import type { ItemRef, TableItem } from './types';

export function isTableItemRef(value: TableItem[string]): value is ItemRef {
  return typeof value === 'object' && value?.$cellRef !== undefined;
}
