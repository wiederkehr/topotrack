import { format } from 'd3-format';

// Format values
export const formatValue = format(',');
export const formatValueCompact = format('.3~s');

// Format differences
export const formatDiff = format('+,');
export const formatDiffCompact = format('+.3~s');

// Format percentages
export const formatPctCompact = format(',.0%');
export const formatPct = format(',.2%');
