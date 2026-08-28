"use client";

import { useCrafterProducts, useDeleteProduct } from "@/hooks/use-products";
import { useUser } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CrafterProductsPage() {
  const { data: user } = useUser();

  const { data: products, isLoading } = useCrafterProducts(user?.crafterProfile?.id);
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your shop inventory</p>
        </div>
        <Link
          href="/crafter/products/new"
          className={buttonVariants({ className: "bg-primary text-white hover:bg-primary/90" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sand overflow-hidden">
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/30 border-b border-sand text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {products.map((product) => {
                  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                  return (
                    <tr key={product.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-sand rounded-lg overflow-hidden relative shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0].startsWith('/') ? `http://localhost:3001${product.images[0]}` : product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-foreground-40">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">{product.category}</td>
                      <td className="px-6 py-4 font-medium text-foreground">Rs. {product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${totalStock > 10 ? 'bg-primary/10 text-primary' :
                          totalStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-secondary/80/10 text-secondary/80'
                          }`}>
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/crafter/products/${product.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-primary" })}>
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-secondary/80 hover:bg-secondary/80/10"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(product.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-foreground-40" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No products yet</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first product.</p>
            <Link
              href="/crafter/products/new"
              className={buttonVariants({ variant: "outline" })}
            >
              Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
