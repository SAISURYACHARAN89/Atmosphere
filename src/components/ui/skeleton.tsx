import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

function HottestStartupsSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-6 mt-6">
        {/* 2nd */}
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-b-xl" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* 1st */}
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <Skeleton className="w-20 h-8 rounded-b-2xl" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* 3rd */}
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-b-xl" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Startup list */}
      <div className="space-y-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border border-border rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}


export { Skeleton, HottestStartupsSkeleton };
