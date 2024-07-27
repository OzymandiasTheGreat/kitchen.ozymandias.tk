import { useMemo } from "react"
import { defaultLang, Strings } from "@/i18n"
import { getLocale, useLocale } from "./useLocale"

export const getStrings = (): Strings => {
  const defaultStrings = Strings[defaultLang]
  const currentStrings = Strings[getLocale()]
  return Object.assign({}, defaultStrings, currentStrings)
}

export const useStrings = () => {
  const [locale] = useLocale()
  const strings = useMemo(() => {
    const defaultStrings = Strings[defaultLang]
    const currentStrings = Strings[locale]
    return Object.assign({}, defaultStrings, currentStrings)
  }, [locale])
  return strings
}
