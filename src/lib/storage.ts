import { Lang } from "@/i18n"
import type { ColorSchemeName } from "react-native"

const LocalStorage = globalThis.localStorage

export default LocalStorage

const COLORSCHEME = "__colorScheme"
const LANGUAGE = "__language"

export const ColorScheme = {
  get(): ColorSchemeName {
    return LocalStorage.getItem(COLORSCHEME) as ColorSchemeName
  },
  set(scheme: ColorSchemeName) {
    return LocalStorage.setItem(COLORSCHEME, scheme as string)
  },
  clear() {
    return LocalStorage.removeItem(COLORSCHEME)
  },
}

export const Language = {
  get(): Lang | null {
    return LocalStorage.getItem(LANGUAGE) as Lang
  },
  set(lang: Lang) {
    return LocalStorage.setItem(LANGUAGE, lang)
  },
  clear() {
    return LocalStorage.removeItem(LANGUAGE)
  },
}
