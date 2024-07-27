import en from "./en.json"
import lt from "./lt.json"

export const defaultLang = "en"
export const Strings = { en, lt }

export type Strings = typeof en | typeof lt
export type Lang = keyof typeof Strings

export const Locales: Lang[] = [defaultLang, "lt"]
