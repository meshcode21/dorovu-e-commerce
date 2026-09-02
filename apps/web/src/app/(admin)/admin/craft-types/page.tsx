"use client";

import { useState } from "react";
import { useCraftTypes, useCreateCraftType, useUpdateCraftType, useDeleteCraftType, type CraftType } from "@/hooks/use-craft-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Scissors, Plus, Edit2 } from "lucide-react";

export default function AdminCraftTypesPage() {
  const { data: craftTypes, isLoading } = useCraftTypes();
  const { mutate: createCraftType, isPending: isCreating } = useCreateCraftType();
  const { mutate: updateCraftType, isPending: isUpdating } = useUpdateCraftType();
  const { mutate: deleteCraftType } = useDeleteCraftType();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isPending = isCreating || isUpdating;

  const startEdit = (craftType: CraftType) => {
    setEditingId(craftType.id);
    setName(craftType.name);
    setDescription(craftType.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateCraftType(
        { id: editingId, data: { name, description } },
        {
          onSuccess: () => cancelEdit(),
        }
      );
    } else {
      createCraftType(
        { name, description },
        {
          onSuccess: () => cancelEdit(),
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Craft Types</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the specific crafting techniques crafters can select.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-sand p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              {editingId ? "Edit Craft Type" : "Add New Craft Type"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Craft Type Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Crochet, Woodworking, Pottery"
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
                  placeholder="Brief description of this craft type"
                ></textarea>
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
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-white hover:bg-primary/90"
                  disabled={isPending || !name.trim()}
                >
                  {isPending ? (
                    editingId ? "Updating..." : "Adding..."
                  ) : (
                    <>
                      {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingId ? "Update" : "Add Craft Type"}
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
            ) : craftTypes && craftTypes.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/30 border-b border-sand text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-4">Craft Type Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {craftTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-primary" />
                        {type.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {type.description || <span className="italic text-foreground-40">No description</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => startEdit(type)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the craft type "${type.name}"?`)) {
                              deleteCraftType(type.id);
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
                No craft types found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
