
// This file contain global function 
// Example
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateRandomId(length: number = 8): string {
  return Math.random().toString(36).substr(2, length);
}