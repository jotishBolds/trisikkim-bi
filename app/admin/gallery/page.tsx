"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Save,
  X,
  ImageIcon,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import Image from "next/image";

interface GalleryCat {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
}
interface GalleryImg {
  id: number;
  categoryId: number;
  src: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
  active: boolean;
}

const inputCls =
  "h-8 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[10px] font-medium text-[#1a1550]/40 mb-0.5 block";

export default function GalleryAdmin() {
  const [cats, setCats] = useState<GalleryCat[]>([]);
  const [imgs, setImgs] = useState<GalleryImg[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Partial<GalleryCat> | null>(null);
  const [editImg, setEditImg] = useState<Partial<GalleryImg> | null>(null);
  const [activeCat, setActiveCat] = useState<number | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/gallery");
      const d = await r.json();
      if (d.success) {
        const c = d.data.map(
          (x: {
            id: number;
            name: string;
            slug: string;
            description: string | null;
            images: GalleryImg[];
          }) => ({
            id: x.id,
            label: x.name,
            slug: x.slug,
            description: x.description,
            sortOrder: 0,
            active: true,
          }),
        );
        setCats(c);
        setImgs(d.data.flatMap((x: { images: GalleryImg[] }) => x.images));
        if (c.length > 0 && !activeCat) setActiveCat(c[0].id);
      } else setError(d.error);
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [activeCat]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const saveCat = async () => {
    if (!editCat) return;
    setError("");
    try {
      const isNew = !editCat.id;
      const r = await fetch(
        isNew ? "/api/gallery" : `/api/gallery/${editCat.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editCat),
        },
      );
      const d = await r.json();
      if (d.success) {
        setEditCat(null);
        fetch_();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    }
  };

  const delCat = async (id: number) => {
    if (!confirm("Delete category and all images?")) return;
    try {
      const r = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) fetch_();
      else setError(d.error);
    } catch {
      setError("Failed to delete.");
    }
  };

  const saveImg = async () => {
    if (!editImg || !editImg.src) return;
    setError("");
    try {
      const r = await fetch("/api/gallery/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editImg),
      });
      const d = await r.json();
      if (d.success) {
        setEditImg(null);
        fetch_();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    }
  };

  const delImg = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      const r = await fetch(`/api/gallery/images?id=${id}`, {
        method: "DELETE",
      });
      const d = await r.json();
      if (d.success) fetch_();
      else setError(d.error);
    } catch {
      setError("Failed to delete.");
    }
  };

  const catImgs = imgs.filter((i) => i.categoryId === activeCat);

  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-[#1077a6] animate-spin" />
      </div>
    );

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-2.5 text-xs border border-red-100">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}

      <Card className="border-[#1077a6]/[0.12]">
        <CardContent className="p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1a1550] flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-[#1077a6]" /> Categories
            </span>
            <Button
              size="sm"
              onClick={() =>
                setEditCat({
                  slug: "",
                  label: "",
                  description: "",
                  sortOrder: 0,
                  active: true,
                })
              }
              className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
            >
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>

          <AnimatePresence>
            {editCat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-[#1077a6]/20 rounded-lg p-3 space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className={labelCls}>Slug</label>
                    <Input
                      value={editCat.slug || ""}
                      onChange={(e) =>
                        setEditCat({ ...editCat, slug: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Label</label>
                    <Input
                      value={editCat.label || ""}
                      onChange={(e) =>
                        setEditCat({ ...editCat, label: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Sort</label>
                    <Input
                      type="number"
                      value={editCat.sortOrder || 0}
                      onChange={(e) =>
                        setEditCat({
                          ...editCat,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={saveCat}
                    className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
                  >
                    <Save className="w-3 h-3" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditCat(null)}
                    className="h-7 text-[10px] gap-1 rounded-md border-[#1077a6]/20"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <div key={c.id} className="flex items-center gap-0.5">
                <button
                  onClick={() => setActiveCat(c.id)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-semibold transition-colors ${activeCat === c.id ? "bg-[#1077a6] text-white" : "bg-[#1077a6]/[0.05] text-[#1077a6] hover:bg-[#1077a6]/10"}`}
                >
                  {c.label} ({imgs.filter((i) => i.categoryId === c.id).length})
                </button>
                <button
                  onClick={() => setEditCat(c)}
                  className="p-1 rounded hover:bg-[#1077a6]/10 text-[#1077a6]"
                >
                  <Pencil className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => delCat(c.id)}
                  className="p-1 rounded hover:bg-red-50 text-red-400"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {cats.length === 0 && (
              <p className="text-[10px] text-[#1a1550]/20">
                No categories yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      
      {activeCat && (
        <Card className="border-[#1077a6]/[0.12]">
          <CardContent className="p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1550] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1077a6]" />{" "}
                {cats.find((c) => c.id === activeCat)?.label}
              </span>
              <Button
                size="sm"
                onClick={() =>
                  setEditImg({
                    categoryId: activeCat,
                    src: "",
                    alt: "",
                    caption: "",
                    sortOrder: 0,
                    active: true,
                  })
                }
                className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
              >
                <Plus className="w-3 h-3" /> Add Image
              </Button>
            </div>

            <AnimatePresence>
              {editImg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-[#1077a6]/20 rounded-lg p-3 space-y-2"
                >
                  <ImageUpload
                    value={editImg.src || ""}
                    onChange={(url) => setEditImg({ ...editImg, src: url })}
                    label="Image"
                    endpoint="galleryUploader"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className={labelCls}>Alt Text</label>
                      <Input
                        value={editImg.alt || ""}
                        onChange={(e) =>
                          setEditImg({ ...editImg, alt: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Caption</label>
                      <Input
                        value={editImg.caption || ""}
                        onChange={(e) =>
                          setEditImg({ ...editImg, caption: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Sort</label>
                      <Input
                        type="number"
                        value={editImg.sortOrder || 0}
                        onChange={(e) =>
                          setEditImg({
                            ...editImg,
                            sortOrder: parseInt(e.target.value) || 0,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      onClick={saveImg}
                      className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
                    >
                      <Save className="w-3 h-3" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditImg(null)}
                      className="h-7 text-[10px] gap-1 rounded-md border-[#1077a6]/20"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {catImgs.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative rounded-lg overflow-hidden border border-[#1077a6]/[0.08] bg-[#1077a6]/[0.02] aspect-square"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      onClick={() => delImg(img.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-md transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {img.alt && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                      <p className="text-white text-[8px] truncate">
                        {img.alt}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
              {catImgs.length === 0 && (
                <div className="col-span-full text-center py-10 text-[10px] text-[#1a1550]/20">
                  No images yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
