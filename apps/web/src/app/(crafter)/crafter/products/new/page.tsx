"use client";

import { useState } from "react";
import { useCreateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCraftTypes } from "@/hooks/use-craft-types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image as ImageIcon, Upload, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

interface VariantInput {
  name: string;
  stock: number;
  priceAdjustment: number;
}

export default function NewProductPage() {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories } = useCategories();
  const { data: craftTypes } = useCraftTypes();
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  
  const [variants, setVariants] = useState<VariantInput[]>([
    { name: 'Default', stock: 0, priceAdjustment: 0 }
  ]);
  
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
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - files.length); // Max 5 total
      
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      // Generate previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
    // Reset input so the same file can be selected again if removed
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // The native input is uncontrolled, we need to inject the manually managed files
    formData.delete('images'); // Remove any default
    files.forEach(file => {
      formData.append('images', file);
    });
    
    // Add variants to form data
    formData.append('variants', JSON.stringify(variants));
    
    // Handle tags
    const tagsInput = formData.get('tags') as string;
    if (tagsInput) {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      formData.set('tags', JSON.stringify(tags));
    }

    // Handle isCustomOrder
    const isCustomOrder = formData.get('isCustomOrder') === 'on';
    formData.set('isCustomOrder', isCustomOrder.toString());

    createProduct(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/crafter/products" 
          className={buttonVariants({ variant: "ghost", size: "icon", className: "text-ink-60 hover:text-ink" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Add New Product</h1>
          <p className="text-ink-60 text-sm mt-1">Fill in the details to list a new item in your shop</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-sand p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label>Product Images</Label>
              <span className="text-xs text-ink-60">{files.length} / 5 uploaded</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-sand group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {files.length < 5 && (
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center aspect-square border-2 border-sand border-dashed rounded-xl cursor-pointer bg-sand/10 hover:bg-sand/30 transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="w-6 h-6 text-ink-40 mb-2" />
                    <span className="text-xs text-forest font-medium">Add Image</span>
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
            {files.length === 0 && <p className="text-xs text-rose mt-1">At least one image is required.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title">Product Title</Label>
              <Input id="title" name="title" placeholder="e.g. Handwoven Dhaka Scarf" required />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                name="category" 
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
              <Input id="tags" name="tags" placeholder="e.g. handmade, traditional, winter" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="price">Base Price (Rs.)</Label>
              <Input id="price" name="price" type="number" min="1" step="0.01" placeholder="e.g. 1500" required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="leadTime">Lead Time (Days)</Label>
              <Input id="leadTime" name="leadTime" type="number" min="1" defaultValue="3" placeholder="e.g. 3" required />
            </div>
          </div>
          
          <div className="space-y-3 flex items-center">
            <input id="isCustomOrder" name="isCustomOrder" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest mr-2" />
            <Label htmlFor="isCustomOrder" className="font-normal text-ink-60">Allow Custom Orders</Label>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              name="description" 
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Describe your product, materials used, and the story behind it..."
              required
            ></textarea>
          </div>

          {/* Variants Section */}
          <div className="border border-sand rounded-xl overflow-hidden">
            <div className="bg-sand/30 p-4 border-b border-sand flex justify-between items-center">
              <div>
                <h3 className="font-medium text-ink">Product Variants</h3>
                <p className="text-xs text-ink-60 mt-1">Add sizes, colors, or materials. At least one variant is required.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="text-forest border-forest/20 hover:bg-forest/10">
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
                      className="text-rose hover:bg-rose/10 shrink-0"
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
            <Button type="submit" className="bg-forest text-white hover:bg-forest/90" disabled={isPending || files.length === 0}>
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
