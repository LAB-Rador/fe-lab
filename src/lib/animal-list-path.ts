export function animalListPath(
    userId: string,
    labId: string,
    rows: number | string,
    page: number | string,
    filters?: unknown,
) {
    const path = `/api/animals/${userId}/${labId}/${rows}/${page}`
    if (filters == null) return path
    return `${path}?${new URLSearchParams({ filters: JSON.stringify(filters) }).toString()}`
}
