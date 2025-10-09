export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="flex gap-4">
        <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-72 bg-gray-200 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
}
