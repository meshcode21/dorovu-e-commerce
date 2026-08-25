"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Tag, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    createCategory({ name, description }, {
      onSuccess: () => {
        setName("");
        setDescription("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Product Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the categories available to crafters when listing products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-sand p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Add New Category</h2>
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
              <Button type="submit" className="w-full bg-forest text-white hover:bg-forest/90" disabled={isPending || !name.trim()}>
                {isPending ? 'Adding...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* List Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-sand overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : categories && categories.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/30 border-b border-sand text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                        <Tag className="w-4 h-4 text-forest" />
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {category.description || <span className="italic text-foreground-40">No description</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-rose hover:bg-rose/10"
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
