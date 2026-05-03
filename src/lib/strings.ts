export function capitalizeEnum(value: string): string {
  if (!value) return ""
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ")
}

