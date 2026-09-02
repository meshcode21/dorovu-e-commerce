export default function ProductsLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card p-6 rounded-xl border border-border sticky top-24 min-h-[300px] animate-pulse"></div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
