import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  useColorScheme as useSystemColorScheme,
  ActivityIndicator,
  type ColorSchemeName,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { DarkTheme as DefaultDarkTheme, DefaultTheme as DefaultLightTheme, ThemeProvider } from "@react-navigation/native"
import MDI from "@expo/vector-icons/MaterialCommunityIcons"
import { Buffer } from "buffer"
import { useFonts } from "expo-font"
import { Inter_700Bold, Inter_400Regular } from "@expo-google-fonts/inter"
import {
  Merriweather_700Bold,
  Merriweather_700Bold_Italic,
  Merriweather_400Regular_Italic,
  Merriweather_400Regular,
} from "@expo-google-fonts/merriweather"
import { useLocales } from "expo-localization"
import { usePathname, useRouter, Stack } from "expo-router"
import Head from "expo-router/head"
import "react-native-reanimated"
import { createThemedStylesheet } from "@/hooks/useTheme"
import { getLocale, useLocale, LocaleContext, UpdateLocaleContext } from "@/hooks/useLocale"
import { getColorScheme, useColorScheme, useTheme, ColorSchemeContext, UpdateColorSchemeContext } from "@/hooks/useTheme"
import { useTitle, TitleContext, UpdateTitleContext } from "@/hooks/useTitle"
import { type Lang, Locales } from "@/i18n"
import { ColorScheme, Language } from "@/lib/storage"

globalThis.Buffer = Buffer

const DarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    background: "transparent",
  },
}

const LightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    background: "transparent",
  },
}

function Root() {
  const theme = useTheme()
  const styles = useStyle()
  const [title] = useTitle()
  const router = useRouter()
  const pathname = usePathname()

  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Merriweather_700Bold,
    Merriweather_700Bold_Italic,
    Merriweather_400Regular_Italic,
    Merriweather_400Regular,
  })

  const isIndex = useMemo(() => pathname === "/", [pathname])
  const toIndex = useCallback(() => router.navigate("/"), [router])
  const goBack = useCallback(() => router.back(), [router])

  const [colorScheme, setColorScheme] = useColorScheme()
  const setDarkTheme = useCallback(() => setColorScheme("dark"), [])
  const setLightTheme = useCallback(() => setColorScheme("light"), [])

  const [locale, setLocale] = useLocale()
  const nextLocale = useMemo(() => Locales.slice(Locales.indexOf(locale)).find((l) => l !== locale) ?? Locales[0], [locale])
  const switchLocale = useCallback(() => setLocale(nextLocale), [nextLocale])

  if (!loaded && !error) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.link} size={256} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.content },
        headerShadowVisible: false,
        headerBackVisible: false,
        title,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: theme.fonts.bodyRegular,
        },
        headerLeft({ canGoBack }) {
          return (
            <View style={styles.header}>
              {!isIndex && (
                <Text style={styles.icon} onPress={canGoBack ? goBack : toIndex}>
                  <MDI name="arrow-left" size={32} color={theme.colors.text} />
                </Text>
              )}
            </View>
          )
        },
        headerRight() {
          return (
            <View style={styles.header}>
              <Text style={styles.icon} onPress={colorScheme === "dark" ? setLightTheme : setDarkTheme}>
                <MDI name={colorScheme === "dark" ? "weather-sunny" : "weather-night"} size={32} color={theme.colors.text} />
              </Text>
              <Text style={styles.lang} onPress={switchLocale}>
                {nextLocale.toLocaleUpperCase()}
              </Text>
            </View>
          )
        },
      }}
    />
  )
}

export default function RootLayout() {
  const [title, setTitle] = useState("")

  const systemScheme = useSystemColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(getColorScheme(null, systemScheme))
  const updateColorScheme = useCallback((colorScheme: ColorSchemeName) => {
    ColorScheme.set(colorScheme)
    setColorScheme(colorScheme)
  }, [])

  const [{ languageCode: systemLocale }] = useLocales()
  const [locale, setLocale] = useState<Lang>(getLocale(null, systemLocale as Lang))
  const updateLocale = useCallback((locale: Lang) => {
    Language.set(locale)
    setLocale(locale)
  }, [])

  useEffect(() => {
    if (Locales.includes(systemLocale as Lang)) {
      updateLocale(systemLocale as Lang)
    }
  }, [updateLocale, systemLocale])

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
      <TitleContext.Provider value={title}>
        <UpdateTitleContext.Provider value={setTitle}>
          <ColorSchemeContext.Provider value={colorScheme}>
            <UpdateColorSchemeContext.Provider value={updateColorScheme}>
              <LocaleContext.Provider value={locale}>
                <UpdateLocaleContext.Provider value={updateLocale}>
                  <Head>
                    <title>{title}</title>
                  </Head>
                  <Root />
                </UpdateLocaleContext.Provider>
              </LocaleContext.Provider>
            </UpdateColorSchemeContext.Provider>
          </ColorSchemeContext.Provider>
        </UpdateTitleContext.Provider>
      </TitleContext.Provider>
    </ThemeProvider>
  )
}

const useStyle = createThemedStylesheet((theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    loader: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.content,
      opacity: 0.6,
    },
    header: {
      flex: 1,
      flexDirection: "row",
      gap: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      height: 64,
    },
    icon: {
      lineHeight: 64,
    },
    lang: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: 22,
      lineHeight: 64,
    },
  }),
)
