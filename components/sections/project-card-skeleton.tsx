import Shimmer from "@/components/shimmer";

export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-lg">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-4/3 bg-stone-300! dark:bg-gray-800 overflow-hidden">
        <Shimmer />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 md:p-8">
        <div className="h-8 bg-stone-300! dark:bg-gray-800 rounded-lg mb-4 w-3/4 overflow-hidden relative">
          <Shimmer />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-3 bg-stone-300! dark:bg-gray-800 rounded w-16 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-stone-300! dark:bg-gray-800 rounded w-24 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>

          <div>
            <div className="h-3 bg-stone-300! dark:bg-gray-800 rounded w-16 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-stone-300! dark:bg-gray-800 rounded w-20 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-3 bg-stone-300! dark:bg-gray-800 rounded w-20 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-stone-300! dark:bg-gray-800 rounded w-32 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
