"use client";

export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

export function SkeletonProfil() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full border-4 border-gray-300" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonKartu({ baris = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: baris }).map((_, i) => (
        <div key={i} className="border-4 border-gray-200 p-6 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTes() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-40" />
      <div className="border-4 border-gray-200 p-8 space-y-6">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHasil() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Skeleton className="h-6 w-40" />
      <div className="border-4 border-gray-200 p-8 text-center space-y-4">
        <Skeleton className="h-5 w-48 mx-auto" />
        <Skeleton className="h-28 w-40 mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
      <div className="border-4 border-gray-200 p-8 space-y-4">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDasbor() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-gray-200 p-6 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-36 mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-4 border-gray-200 p-6 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
