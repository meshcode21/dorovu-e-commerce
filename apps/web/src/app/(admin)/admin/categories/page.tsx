"use client";

import { useState, useRef } from "react";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory, type Category } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Tag, Plus, Edit2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPending = isCreating || isUpdating;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setImageFile(null);
    setImagePreview(category.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    removeImage();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    if (editingId) {
      updateCategory(
        { id: editingId, data: formData },
        {
          onSuccess: () => cancelEdit(),
        }
      );
    } else {
      createCategory(formData, {
        onSuccess: () => cancelEdit(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Product Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the categories available to crafters when listing products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-sand p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Handmade Furniture"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Brief description of this category"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-sand/20 border border-sand group">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          onClick={removeImage}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-sand rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-sand/10 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs opacity-70 mt-1">PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={cancelEdit}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90" disabled={isPending || !name.trim()}>
                  {isPending ? (editingId ? 'Updating...' : 'Adding...') : (
                    <>
                      {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingId ? 'Update' : 'Add Category'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* List Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-sand overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : categories && categories.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/30 border-b border-sand text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-4 w-16">Image</th>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-6 py-4">
                        {category.image ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden relative border border-sand">
                            <Image src={category.image} alt={category.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-sand/30 border border-sand flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {category.description || <span className="italic text-foreground-40">No description</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => startEdit(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                              deleteCategory(category.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No categories found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
