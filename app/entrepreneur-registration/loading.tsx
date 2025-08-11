import { Skeleton } from "@/components/ui/skeleton"

export default function EntrepreneurRegistrationLoading() {
  return (
    <div className="container py-10 space-y-8">
      <Skeleton className="h-12 w-3/4 max-w-md" />
      <Skeleton className="h-6 w-full max-w-lg" />
      
      <div className="space-y-6 mt-8">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full max-w-sm mx-auto mt-8" />
    </div>
  )
}
