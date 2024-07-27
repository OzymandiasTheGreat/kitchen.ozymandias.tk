import { useEffect, useState } from "react"
import { usePathname } from "expo-router"
import { ERROR_404, SERVER_ERROR } from "@/lib/errors"
import { useLocale } from "./useLocale"
import { useStrings } from "./useStrings"

const PAGE_INDEX = /\/posts\/(\d+)/i

export interface Content {
  last: boolean
  content: {
    title: string
    slug: string
    author?: string
    published: string
    edited?: string
    source?: string
    filename: string
  }[]
}

const DEFAULT_CONTENT: Content = {
  last: true,
  content: [],
}

function extractPageIndex(pathname: string): number {
  if (pathname === "/") return 0
  const match = pathname.match(PAGE_INDEX)
  if (!match) return -1
  const index = parseInt(match[1])
  return index - 1
}

export const useIndex = () => {
  const pathname = usePathname()
  const index = extractPageIndex(pathname)
  return index
}

export const usePages = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [locale] = useLocale()
  const index = useIndex()
  const strings = useStrings()
  const filename = `${locale}-` + `${index}`.padStart(4, "0") + ".json"

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      try {
        const response = await fetch(`/content/${filename}`)

        if (response.status !== 200) {
          if (response.status === 404) {
            setError(ERROR_404(strings))
          } else {
            setError(SERVER_ERROR(response.status, strings))
          }
          setContent(DEFAULT_CONTENT)
          setLoading(false)
          return
        }

        const content = await response.json()

        setError(null)
        setContent(content)
        setLoading(false)
      } catch (err: any) {
        setError(SERVER_ERROR(-1, strings, err))
        setContent(DEFAULT_CONTENT)
        setLoading(false)
      }
    })()
  }, [filename, index])

  return { data: { ...content, index: index + 1 }, loading, error }
}
