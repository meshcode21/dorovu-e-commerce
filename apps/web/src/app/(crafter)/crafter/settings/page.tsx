"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { useCrafterStore, useUpdateCrafterStore } from "@/hooks/use-crafter-store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/utils/queryKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, X, Image as ImageIcon } from "lucide-react";

export default function SettingsPage() {
  const { data: user } = useUser();
  const { data: store, isLoading } = useCrafterStore(user?.id);
  const { mutate: updateStore, isPending } = useUpdateCrafterStore();

  const { data: craftTypes } = useQuery({
    queryKey: queryKeys.craftTypes.all(),
    queryFn: async () => {
      const { data } = await api.get("/craft-types");
      return data.craftTypes;
    },
  });

  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    craftType: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    if (store) {
      setFormData({
        storeName: store.storeName || "",
        description: store.description || "",
        craftType: store.craftType || "",
      });
      if (store.portfolioImages) {
        setExistingImages(store.portfolioImages);
      }
    }
  }, [store]);

  useEffect(() => {
    return () => {
      newFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [newFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, craftType: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const remainingSlots = 5 - (existingImages.length + newFiles.length);
      const selectedFiles = Array.from(e.target.files).slice(0, remainingSlots);

      const added = selectedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setNewFiles(prev => [...prev, ...added]);
    }
    e.target.value = '';
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => {
      const fileToRemove = prev[index];
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("storeName", formData.storeName);
    fd.append("description", formData.description);
    fd.append("craftType", formData.craftType);
    fd.append("existingImages", JSON.stringify(existingImages));
    
    newFiles.forEach(({ file }) => {
      fd.append("images", file);
    });

    updateStore(fd);
  };

  const totalImagesCount = existingImages.length + newFiles.length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Shop Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public shop profile and details.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Store Information
            </CardTitle>
            <CardDescription>
              This information will be displayed publicly to your customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label>Portfolio Images</Label>
                <span className="text-xs text-muted-foreground">{totalImagesCount} / 5 uploaded</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-sand group">
                    <img src={src} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Newly Added Files */}
                {newFiles.map((item, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-primary/40 group">
                    <img src={item.preview} alt={`New upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-primary text-[10px] text-white px-1.5 py-0.5 rounded font-medium">New</span>
                  </div>
                ))}

                {totalImagesCount < 5 && (
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

            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
                placeholder="My Awesome Shop"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="craftType">Primary Craft Type</Label>
              <Select value={formData.craftType} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a craft type" />
                </SelectTrigger>
                <SelectContent>
                  {craftTypes?.map((ct: any) => (
                    <SelectItem key={ct.id} value={ct.name}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Store Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Tell customers about your crafts and process..."
                className="min-h-[150px]"
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
