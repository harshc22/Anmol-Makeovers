"use client"
import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/portfolio/supabaseClient"
import { BUCKET, DEFAULT_PREFIX } from "@/lib/portfolio/config"
import { joinPrefix } from "@/lib/portfolio/storage"

export interface Item { name: string; path: string; updated_at?: string }

export function usePortfolio(prefix: string = DEFAULT_PREFIX) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const bucket = BUCKET

  const fetchAlbum = useCallback(async (pfx: string) => {
    setLoading(true)
    setError(null)

    const listPrefix = async (path: string) => {
      const { data, error } = await supabase.storage.from(bucket).list(path, {
        limit: 1000,
        sortBy: { column: "updated_at", order: "desc" },
      })
      if (error) throw error
      return data || []
    }

    try {
      const files: Item[] = []
      const folders: string[] = []

      const rootEntries = await listPrefix(pfx === "" ? "" : pfx)
      for (const e of rootEntries) {
        if (e.name && (e.metadata || /\.[a-z0-9]+$/i.test(e.name))) {
          files.push({ name: e.name, path: pfx ? joinPrefix(pfx, e.name) : e.name, updated_at: e.updated_at })
        } else if (e.name) {
          folders.push(e.name)
        }
      }

      if (pfx === "") {
        // also crawl top-level folders when showing All
        const lists = await Promise.all(
          folders.map(async (folder) => {
            try {
              const sub = await listPrefix(`${folder}/`)
              return sub
                .filter((f: any) => f.name)
                .map((f: any) => ({ name: f.name, path: `${folder}/${f.name}`, updated_at: f.updated_at }))
            } catch {
              return []
            }
          })
        )
        lists.forEach((arr) => files.push(...arr))
      } else if (folders.length) {
        // when in a specific album, crawl only its immediate subfolders
        const lists = await Promise.all(
          folders.map(async (folder) => {
            try {
              const subPrefix = joinPrefix(pfx, `${folder}/`)
              const sub = await listPrefix(subPrefix)
              return sub
                .filter((f: any) => f.name)
                .map((f: any) => ({ name: f.name, path: joinPrefix(subPrefix, f.name), updated_at: f.updated_at }))
            } catch {
              return []
            }
          })
        )
        lists.forEach((arr) => files.push(...arr))
      }

      files.sort((a, b) => {
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0
        return tb - ta
      })

      setItems(files)
    } catch (err: any) {
      console.error("list error", err)
      setError(err?.message || "Failed to list images")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [bucket])

  useEffect(() => { fetchAlbum(prefix) }, [prefix, fetchAlbum])

  return { items, loading, error, baseUrl, bucket }
}