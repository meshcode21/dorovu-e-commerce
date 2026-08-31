"use client";

import { useState, useEffect } from "react";
import { useProduct, useUpdateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCraftTypes } from "@/hooks/use-craft-types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image as ImageIcon, Upload, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface VariantInput {
  id?: string;
  name: string;
  stock: number;
  priceAdjustment: number;
}

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct(id);
  const { data: categories } = useCategories();
  const { data: craftTypes } = useCraftTypes();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [variants, setVariants] = useState<VariantInput[]>([
    { name: 'Default', stock: 0, priceAdjustment: 0 }
  ]);

  // Load product data into state when available
  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      }
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          id: v.id,
          name: v.name,
          stock: v.stock,
          priceAdjustment: v.priceAdjustment || 0
        })));
      }
    }
  }, [product]);

  const addVariant = () => {
    setVariants([...variants, { name: '', stock: 0, priceAdjustment: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - (files.length + (product?.images?.length || 0))); // Max 5 total

      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      // Generate previews for new files
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    const removedPreview = newPreviews.splice(index, 1)[0];
    setImagePreviews(newPreviews);

    // If it's a newly added file (object URL), remove from files array
    if (removedPreview.startsWith('blob:')) {
      const fileIndex = files.findIndex(f => URL.createObjectURL(f) === removedPreview);
      if (fileIndex !== -1) {
        const newFiles = [...files];
        newFiles.splice(fileIndex, 1);
        setFiles(newFiles);
      }
      URL.revokeObjectURL(removedPreview);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // The native input is uncontrolled, we need to inject the manually managed files
    formData.delete('images'); // Remove any default
    files.forEach(file => {
      formData.append('images', file);
    });

    // In a real app, we'd also send the remaining existing image URLs so the backend knows which to keep.
    // For MVP, backend just appends new images if any are uploaded. 

    // Add variants to form data
    formData.append('variants', JSON.stringify(variants));

    // Handle tags
    const tagsInput = formData.get('tags') as string;
    if (tagsInput && tagsInput.trim() !== '') {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      formData.set('tags', JSON.stringify(tags));
    } else {
      formData.set('tags', JSON.stringify([]));
    }

    // Handle isCustomOrder
    const isCustomOrder = formData.get('isCustomOrder') === 'on';
    formData.set('isCustomOrder', isCustomOrder.toString());

    updateProduct(formData);
  };

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/crafter/products"
          className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground text-sm mt-1">Update the details for your listing</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-sand p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label>Product Images</Label>
              <span className="text-xs text-muted-foreground">{imagePreviews.length} / 5 uploaded</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-sand group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center aspect-square border-2 border-sand border-dashed rounded-xl cursor-pointer bg-sand/10 hover:bg-sand/30 transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="w-6 h-6 text-foreground-40 mb-2" />
                    <span className="text-xs text-primary font-medium">Add Image</span>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title">Product Title</Label>
              <Input id="title" name="title" defaultValue={product.title} placeholder="e.g. Handwoven Dhaka Scarf" required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={product.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a category...</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="craftType">Craft Type</Label>
              <select
                id="craftType"
                name="craftType"
                defaultValue={product.craftType}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a craft type...</option>
                {craftTypes?.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={product.tags?.join(', ')} placeholder="e.g. handmade, traditional, winter" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="price">Base Price (Rs.)</Label>
              <Input id="price" name="price" type="number" min="1" step="0.01" defaultValue={product.price} placeholder="e.g. 1500" required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="leadTime">Lead Time (Days)</Label>
              <Input id="leadTime" name="leadTime" type="number" min="1" defaultValue={product.leadTime} placeholder="e.g. 3" required />
            </div>
          </div>

          <div className="space-y-3 flex items-center">
            <input id="isCustomOrder" name="isCustomOrder" type="checkbox" defaultChecked={product.isCustomOrder} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" />
            <Label htmlFor="isCustomOrder" className="font-normal text-muted-foreground">Allow Custom Orders</Label>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Describe your product, materials used, and the story behind it..."
              required
            ></textarea>
          </div>

          {/* Variants Section */}
          <div className="border border-sand rounded-xl overflow-hidden">
            <div className="bg-sand/30 p-4 border-b border-sand flex justify-between items-center">
              <div>
                <h3 className="font-medium text-foreground">Product Variants</h3>
                <p className="text-xs text-muted-foreground mt-1">Add sizes, colors, or materials. At least one variant is required.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="text-primary border-primary/20 hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end pb-4 border-b border-sand/50 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Variant Name</Label>
                    <Input
                      placeholder="e.g. Small, Red, Oak"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-32 space-y-2">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-40 space-y-2">
                    <Label className="text-xs">Price Adjustment (Rs.)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 200 or -50"
                      value={variant.priceAdjustment}
                      onChange={(e) => updateVariant(index, 'priceAdjustment', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                      className="text-secondary/80 hover:bg-secondary/80/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-sand">
            <Link href="/crafter/products" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isPending || imagePreviews.length === 0}>
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
