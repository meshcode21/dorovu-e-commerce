export default function ProductDetailLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded mb-8"></div>
      
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="flex flex-col md:border-r border-border">
            <div className="bg-muted relative aspect-square"></div>
          </div>

          {/* Product Details */}
          <div className="p-8 md:p-12 flex flex-col space-y-6">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded-full"></div>
              <div className="h-6 w-20 bg-muted rounded-full"></div>
            </div>

            <div className="h-10 w-3/4 bg-muted rounded"></div>
            
            <div className="h-5 w-40 bg-muted rounded"></div>

            <div className="h-10 w-32 bg-muted rounded"></div>

            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="h-14 bg-muted rounded-xl"></div>
              <div className="h-14 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
