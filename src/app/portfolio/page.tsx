"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// ---- CONFIG ----
const BUCKET = process.env.NEXT_PUBLIC_PORTFOLIO_BUCKET || 'Portfolio'

// Accept newline OR comma separated prefixes from env
const RAW_PREFIXES = (process.env.NEXT_PUBLIC_PORTFOLIO_PREFIXES || '')
  .split(/[\n,]/)
  .map(s => s.trim())
  .filter(Boolean)

/**
 * Normalize prefixes:
 * - '' stays ''
 * - strip any leading slashes
 * - ensure a single trailing slash for non-root
 */
const ALBUM_PREFIXES = RAW_PREFIXES.map(p =>
  p === '' ? '' : p.replace(/^\/+/, '').replace(/\/?$/, '/')
)

// Default to showing "All" ('' means All)
const DEFAULT_PREFIX = ''

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Build a public URL for a file
function publicUrl(baseUrl: string, bucket: string, path: string) {
  const base = `${baseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/`
  const parts = path.split('/').map(encodeURIComponent)
  return base + parts.join('/')
}

/** Safe prefix join: ensures correct single slash placement */
function joinPrefix(prefix: string, name: string) {
  if (!prefix) return name
  const clean = prefix.replace(/^\/+/, '').replace(/\/?$/, '/')
  return clean + name
}

interface Item { name: string; path: string; updated_at?: string }

export default function PortfolioPage() {
  const [album, setAlbum] = useState<string>(DEFAULT_PREFIX)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const fetchAlbum = useCallback(async (prefix: string) => {
    setLoading(true)
    setError(null)

    // If prefix === '' treat as ALL: recursively walk top-level folders + root files
    if (prefix === '') {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).list('', {
          limit: 1000,
          sortBy: { column: 'updated_at', order: 'desc' },
        })
        if (error) throw error

        const files: Item[] = []
        const folders: string[] = []

        for (const e of data || []) {
          if (e.name && (e.metadata || /\.[a-z0-9]+$/i.test(e.name))) {
            files.push({ name: e.name, path: e.name, updated_at: e.updated_at })
          } else if (e.name) {
            folders.push(e.name)
          }
        }

        if (folders.length) {
          const lists = await Promise.all(folders.map(async (folder) => {
            try {
              const res = await supabase.storage.from(BUCKET).list(`${folder}/`, { limit: 1000 })
              if (res.error) return []
              return (res.data || []).filter((f: any) => f.name).map((f: any) => ({
                name: f.name,
                path: `${folder}/${f.name}`,
                updated_at: f.updated_at,
              }))
            } catch {
              return []
            }
          }))
          lists.forEach(arr => files.push(...arr))
        }

        const sorted = files.sort((a, b) => {
          const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0
          const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0
          return tb - ta
        })
        setItems(sorted)
      } catch (err: any) {
        console.error('list error', err)
        setError(err?.message || 'Failed to list images')
        setItems([])
      } finally {
        setLoading(false)
      }
      return
    }

    // otherwise list a single prefix (folder)
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: 1000,
        sortBy: { column: 'updated_at', order: 'desc' },
      })
      if (error) throw error

      const entries = data || []

      const files: Item[] = []
      const folders: string[] = []

      for (const e of entries) {
        if (e.name && (e.metadata || /\.[a-z0-9]+$/i.test(e.name))) {
          files.push({ name: e.name, path: joinPrefix(prefix, e.name), updated_at: e.updated_at })
        } else if (e.name) {
          folders.push(e.name)
        }
      }

      if (folders.length) {
        const lists = await Promise.all(folders.map(async (folder) => {
          try {
            const subPrefix = joinPrefix(prefix, `${folder}/`)
            const res = await supabase.storage.from(BUCKET).list(subPrefix, { limit: 1000 })
            if (res.error) return []
            return (res.data || []).filter((f: any) => f.name).map((f: any) => ({
              name: f.name,
              path: joinPrefix(subPrefix, f.name),
              updated_at: f.updated_at,
            }))
          } catch {
            return []
          }
        }))
        lists.forEach(arr => files.push(...arr))
      }

      const sorted = files.sort((a, b) => {
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0
        return tb - ta
      })
      setItems(sorted)
    } catch (err: any) {
      console.error('list error', err)
      setError(err?.message || 'Failed to list images')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlbum(album)
  }, [album, fetchAlbum])

  type AlbumDef = { label: string; prefix: string }
  const albumDefs: AlbumDef[] = useMemo(() => {
    // always expose an 'All' option (prefix === '')
    const defs: AlbumDef[] = [{ label: 'All', prefix: '' }]
    if (ALBUM_PREFIXES.length) {
      defs.push(...ALBUM_PREFIXES.map(p => ({
        label: p.replace(/\/$/, '') || 'All',
        prefix: p
      })))
    }
    return defs
  }, [])

  // ---- LIGHTBOX ----
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const urls = useMemo(() => items.map(it => publicUrl(baseUrl, BUCKET, it.path)), [items, baseUrl])

  const openAt = (idx: number) => { setCurrent(idx); setOpen(true) }
  const close = () => setOpen(false)
  const prev = () => setCurrent(i => (i - 1 + urls.length) % urls.length)
  const next = () => setCurrent(i => (i + 1) % urls.length)

  // keyboard controls when lightbox is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // ---- MOBILE ALBUM CAROUSEL (scrollable chips) ----
  const chipsRef = useRef<HTMLDivElement | null>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Ensure the active chip is scrolled into view on change
  useEffect(() => {
    const idx = albumDefs.findIndex(a => a.prefix === album)
    const el = chipRefs.current[idx]
    if (el && chipsRef.current) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [album, albumDefs])

  return (
    <main className="mx-auto max-w-7xl p-6 mt-20">
      <div className="relative flex items-center justify-between gap-4 mb-3">
        <h1 className="text-3xl hidden sm:block font-serif">PORTFOLIO</h1>

        {/* Desktop album buttons */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {albumDefs.map(({ label, prefix }) => (
            <button
              key={prefix || 'root'}
              onClick={() => setAlbum(prefix)}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${album === prefix ? 'bg-primary text-light border-primary' : 'bg-background text-heading border-gray hover:bg-accent/30'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE: horizontally scrollable carousel of album chips */}
      <div
        ref={chipsRef}
        className="md:hidden -mx-4 px-4 mb-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Album selector"
        role="tablist"
      >
        <div className="flex items-center gap-2 snap-x snap-mandatory">
          {albumDefs.map(({ label, prefix }, i) => (
            <button
              ref={el => { chipRefs.current[i] = el; }}
              key={prefix || 'root'}
              role="tab"
              aria-selected={album === prefix}
              onClick={() => setAlbum(prefix)}
              className={`snap-start px-3 py-2 rounded-full border text-sm shrink-0 transition ${album === prefix ? 'bg-primary text-light border-primary' : 'bg-background text-heading border-gray hover:bg-accent/30'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      {loading && <div className="p-4 text-gray-500">Loading images…</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {/* Masonry-style grid using CSS columns (no JS) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {items.map((it, idx) => {
          const url = publicUrl(baseUrl, BUCKET, it.path)
          return (
            <figure key={it.path} className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow ring-1 ring-black/5">
              {/* Use <img> to avoid Next transforms on free tier */}
              <img
                src={url}
                alt={it.name}
                loading="lazy"
                decoding="async"
                className="w-full h-auto cursor-zoom-in block"
                onClick={() => openAt(idx)}
              />
            </figure>
          )
        })}
      </div>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={urls[current]}
              alt="Full view"
              className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
              loading="eager"
              decoding="async"
            />
            {/* Controls */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-primary text-light hover:opacity-90 shadow"
            >✕</button>
            {urls.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute top-1/2 -translate-y-1/2 left-2 px-3 py-2 rounded-full bg-primary text-light hover:opacity-90 shadow"
                >‹</button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute top-1/2 -translate-y-1/2 right-2 px-3 py-2 rounded-full bg-primary text-light hover:opacity-90 shadow"
                >›</button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
