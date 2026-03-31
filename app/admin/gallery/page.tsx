"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Video,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import Image from "next/image";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

/* ─── Types ──────────────────────────────────────────────────────────── */
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
interface GalleryVid {
  id: number;
  title: string;
  youtubeUrl: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  publishedAt: string;
}

const inputCls =
  "h-8 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[10px] font-medium text-[#1a1550]/40 mb-0.5 block";

/* ═════════════════════════════════════════════════════════════════════ */
export default function GalleryAdmin() {
  const [adminMode, setAdminMode] = useState<"photo" | "video">("photo");
  const [cats, setCats] = useState<GalleryCat[]>([]);
  const [imgs, setImgs] = useState<GalleryImg[]>([]);
  const [vids, setVids] = useState<GalleryVid[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Partial<GalleryCat> | null>(null);
  const [editImg, setEditImg] = useState<Partial<GalleryImg> | null>(null);
  const [editVid, setEditVid] = useState<Partial<GalleryVid> | null>(null);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const activeCatRef = useRef<number | null>(null);

  /* ── Fetch photos ── */
  const fetchPhotos = useCallback(async () => {
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
        if (c.length > 0 && !activeCatRef.current) {
          activeCatRef.current = c[0].id;
          setActiveCat(c[0].id);
        }
      } else setError(d.error);
    } catch {
      setError("Failed to load photos.");
    }
  }, []);

  /* ── Fetch videos ── */
  const fetchVideos = useCallback(async () => {
    try {
      const r = await fetch("/api/gallery/videos");
      const d = await r.json();
      if (d.success) setVids(d.data);
      else setError(d.error);
    } catch {
      setError("Failed to load videos.");
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchPhotos(), fetchVideos()]).finally(() =>
      setLoading(false),
    );
  }, [fetchPhotos, fetchVideos]);

  useEffect(() => {
    activeCatRef.current = activeCat;
  }, [activeCat]);

  /* ── Category CRUD ── */
  const saveCat = async () => {
    if (!editCat) return;
    setError("");
    try {
      const isNew = !editCat.id;
      // ✅ FIX: categories now live under /api/gallery/categories/[id]
      const r = await fetch(
        isNew ? "/api/gallery" : `/api/gallery/categories/${editCat.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: editCat.slug,
            label: editCat.label,
            description: editCat.description,
            sortOrder: editCat.sortOrder,
            active: editCat.active,
          }),
        },
      );
      const d = await r.json();
      if (d.success) {
        setEditCat(null);
        fetchPhotos();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    }
  };

  const delCat = async (id: number) => {
    if (!confirm("Delete category and all its images?")) return;
    try {
      // ✅ FIX: categories now live under /api/gallery/categories/[id]
      const r = await fetch(`/api/gallery/categories/${id}`, {
        method: "DELETE",
      });
      const d = await r.json();
      if (d.success) {
        if (activeCat === id) {
          setActiveCat(null);
          activeCatRef.current = null;
        }
        fetchPhotos();
      } else setError(d.error);
    } catch {
      setError("Failed to delete.");
    }
  };

  /* ── Image CRUD ── */
  const saveImg = async () => {
    if (!editImg || !editImg.src) return;
    setError("");
    try {
      const r = await fetch("/api/gallery/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: editImg.categoryId,
          src: editImg.src,
          alt: editImg.alt,
          caption: editImg.caption,
          sortOrder: editImg.sortOrder,
          active: editImg.active,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setEditImg(null);
        fetchPhotos();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    }
  };

  const delImg = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      const r = await fetch(`/api/gallery/images?id=${id}`, {
        method: "DELETE",
      });
      const d = await r.json();
      if (d.success) fetchPhotos();
      else setError(d.error);
    } catch {
      setError("Failed to delete.");
    }
  };

  /* ── Video CRUD ── */
  const saveVid = async () => {
    if (!editVid || !editVid.youtubeUrl || !editVid.title) return;
    setError("");
    const vidId = extractYouTubeId(editVid.youtubeUrl || "");
    if (!vidId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }
    try {
      const isNew = !editVid.id;
      const payload = {
        title: editVid.title,
        youtubeUrl: editVid.youtubeUrl,
        description: editVid.description || null,
        sortOrder: editVid.sortOrder ?? 0,
        active: editVid.active ?? true,
      };
      const r = await fetch(
        isNew ? "/api/gallery/videos" : `/api/gallery/videos/${editVid.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const d = await r.json();
      if (d.success) {
        setEditVid(null);
        fetchVideos();
      } else setError(d.error);
    } catch {
      setError("Failed to save video.");
    }
  };

  const delVid = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    try {
      const r = await fetch(`/api/gallery/videos/${id}`, {
        method: "DELETE",
      });
      const d = await r.json();
      if (d.success) fetchVideos();
      else setError(d.error);
    } catch {
      setError("Failed to delete video.");
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
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Mode toggle ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAdminMode("photo")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-colors ${
            adminMode === "photo"
              ? "bg-[#1077a6] text-white"
              : "bg-[#1077a6]/[0.06] text-[#1077a6] hover:bg-[#1077a6]/10"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Photo Gallery
        </button>
        <button
          onClick={() => setAdminMode("video")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-colors ${
            adminMode === "video"
              ? "bg-[#1077a6] text-white"
              : "bg-[#1077a6]/[0.06] text-[#1077a6] hover:bg-[#1077a6]/10"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Video Gallery
          {vids.length > 0 && (
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                adminMode === "video"
                  ? "bg-white/20 text-white"
                  : "bg-[#1077a6]/15 text-[#1077a6]"
              }`}
            >
              {vids.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
         PHOTO GALLERY ADMIN
         ══════════════════════════════════════════════════════════════ */}
      {adminMode === "photo" && (
        <>
          <Card className="border-[#1077a6]/[0.12]">
            <CardContent className="p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1a1550] flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-[#1077a6]" />{" "}
                  Categories
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
                          placeholder="e.g. cultural-events"
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
                          placeholder="Category name"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Sort Order</label>
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
                      className={`px-2.5 py-1.5 rounded-md text-[10px] font-semibold transition-colors ${
                        activeCat === c.id
                          ? "bg-[#1077a6] text-white"
                          : "bg-[#1077a6]/[0.05] text-[#1077a6] hover:bg-[#1077a6]/10"
                      }`}
                    >
                      {c.label} (
                      {imgs.filter((i) => i.categoryId === c.id).length})
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
                              setEditImg({
                                ...editImg,
                                caption: e.target.value,
                              })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Sort Order</label>
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
         VIDEO GALLERY ADMIN
         ══════════════════════════════════════════════════════════════ */}
      {adminMode === "video" && (
        <Card className="border-[#1077a6]/[0.12]">
          <CardContent className="p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1550] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#1077a6]" /> Video Gallery
              </span>
              <Button
                size="sm"
                onClick={() =>
                  setEditVid({
                    title: "",
                    youtubeUrl: "",
                    description: "",
                    sortOrder: 0,
                    active: true,
                  })
                }
                className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
              >
                <Plus className="w-3 h-3" /> Add Video
              </Button>
            </div>

            <AnimatePresence>
              {editVid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-[#1077a6]/20 rounded-lg p-3 space-y-2.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Title *</label>
                      <Input
                        value={editVid.title || ""}
                        onChange={(e) =>
                          setEditVid({ ...editVid, title: e.target.value })
                        }
                        className={inputCls}
                        placeholder="Video title"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>YouTube URL *</label>
                      <Input
                        value={editVid.youtubeUrl || ""}
                        onChange={(e) =>
                          setEditVid({
                            ...editVid,
                            youtubeUrl: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {editVid.youtubeUrl && (
                        <div className="mt-1">
                          {extractYouTubeId(editVid.youtubeUrl) ? (
                            <span className="text-[9px] text-green-600 font-mono">
                              ✓ ID: {extractYouTubeId(editVid.youtubeUrl)}
                            </span>
                          ) : (
                            <span className="text-[9px] text-red-500">
                              ✗ Could not extract video ID
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Sort Order</label>
                      <Input
                        type="number"
                        value={editVid.sortOrder || 0}
                        onChange={(e) =>
                          setEditVid({
                            ...editVid,
                            sortOrder: parseInt(e.target.value) || 0,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Description (optional)</label>
                      <Textarea
                        value={editVid.description || ""}
                        onChange={(e) =>
                          setEditVid({
                            ...editVid,
                            description: e.target.value,
                          })
                        }
                        className="text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20 min-h-[60px]"
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>

                  {editVid.youtubeUrl &&
                    extractYouTubeId(editVid.youtubeUrl) && (
                      <div className="relative w-48 aspect-video rounded-lg overflow-hidden border border-[#1077a6]/10">
                        <Image
                          src={getYouTubeThumbnail(editVid.youtubeUrl)}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#f4c430]/90 flex items-center justify-center">
                            <Video className="w-3.5 h-3.5 text-[#1a1550]" />
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      onClick={saveVid}
                      className="h-7 text-[10px] gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
                    >
                      <Save className="w-3 h-3" />{" "}
                      {editVid.id ? "Update Video" : "Save Video"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditVid(null)}
                      className="h-7 text-[10px] gap-1 rounded-md border-[#1077a6]/20"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {vids.map((vid, i) => {
                const videoId = extractYouTubeId(vid.youtubeUrl);
                return (
                  <motion.div
                    key={vid.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative rounded-lg overflow-hidden border border-[#1077a6]/[0.08] bg-white"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={getYouTubeThumbnail(vid.youtubeUrl)}
                        alt={vid.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditVid(vid)}
                          className="opacity-0 group-hover:opacity-100 bg-white text-[#1077a6] p-1.5 rounded-md transition-opacity"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => delVid(vid.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-md transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {videoId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 bg-white text-[#1a1550] p-1.5 rounded-md transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        ▶ YouTube
                      </div>
                    </div>

                    <div className="p-2.5">
                      <p className="text-[11px] font-semibold text-[#1a1550] line-clamp-2 leading-snug">
                        {vid.title}
                      </p>
                      {vid.description && (
                        <p className="text-[9px] text-[#1a1550]/40 mt-1 line-clamp-1">
                          {vid.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] text-[#1a1550]/30 font-mono">
                          Order: {vid.sortOrder}
                        </span>
                        {videoId && (
                          <span className="text-[8px] text-[#1077a6]/50 font-mono">
                            {videoId}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {vids.length === 0 && (
                <div className="col-span-full text-center py-12 text-[10px] text-[#1a1550]/20 space-y-2">
                  <Video className="w-8 h-8 mx-auto text-[#1a1550]/10" />
                  <p>No videos yet. Add your first YouTube video above.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
