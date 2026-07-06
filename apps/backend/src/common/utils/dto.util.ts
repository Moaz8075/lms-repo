/** Treat empty form strings as undefined so @IsOptional() skips other validators. */
export function emptyToUndefined({ value }: { value: unknown }): unknown {
  if (value === '' || value === null) return undefined;
  return value;
}
