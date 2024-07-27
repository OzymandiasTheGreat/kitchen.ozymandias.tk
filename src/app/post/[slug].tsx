import { useEffect, useMemo } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { useFocusEffect, Link } from "expo-router"
import Markdown, { ElementStyles } from "exponent-markdown"
import { Footer } from "@/components/footer"
import { usePost } from "@/hooks/usePost"
import { useStrings } from "@/hooks/useStrings"
import { createThemedStylesheet, useTheme } from "@/hooks/useTheme"
import { useTitle } from "@/hooks/useTitle"

export default function PostPage() {
  const theme = useTheme()
  const styles = useStyle()
  const strings = useStrings()
  const [_, setTitle] = useTitle()
  const { content, data, loading, error } = usePost()
  const title = !!data
    ? `${data.title} | ${strings.title}`
    : loading
    ? `${strings.loading} | ${strings.title}`
    : !!error
    ? `${strings.error} ${error.code} | ${strings.title}`
    : `${strings.title}`
  const elementStyles: ElementStyles = useMemo(
    () => ({
      emphasis: {
        fontFamily: theme.fonts.contentItalic,
      },
      strong: {
        fontFamily: theme.fonts.contentBold,
      },
      link: {
        color: theme.colors.link,
      },
      paragraph: {
        fontFamily: theme.fonts.contentRegular,
        fontSize: theme.size.content,
      },
      heading: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.size.heading * 0.8,
        fontWeight: "bold",
      },
      thematicBreak: {
        width: "100%",
      },
      table: {
        alignSelf: "flex-start",
        marginBottom: theme.spacing.medium,
        marginHorizontal: theme.spacing.medium,
        minWidth: "90%",
      },
      tableRow: {
        borderColor: theme.colors.text,
      },
      tableCell: {
        flex: 1,
        padding: theme.spacing.small,
        borderColor: theme.colors.text,
        fontFamily: theme.fonts.contentRegular,
      },
    }),
    [theme],
  )

  useFocusEffect(() => setTitle(title))
  useEffect(() => setTitle(title), [title])

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loader}>
          <ActivityIndicator size={256} color={theme.colors.link} />
        </View>
        <Footer />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.error}>
          <Text style={styles.error_message}>{error.message}</Text>
          {!!error.cause && <Text style={styles.error_cause}>{(error.cause as any).message}</Text>}
        </View>
        <Footer />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.post}>
          <View style={styles.meta}>
            <Text style={styles.title}>{data!.title}</Text>
            <View style={styles.tagline}>
              <Text style={styles.author}>{data!.author ?? strings.me}</Text>
              <Text style={styles.date}>
                {new Date(data!.published).toLocaleString()}{" "}
                {!!data!.edited && `${strings.edited} ${new Date(data!.edited).toLocaleString()}`}
              </Text>
            </View>
          </View>
          <Markdown text={content!} style={styles.markdown} elementStyles={elementStyles} />
          {!!data?.source && (
            <Text style={styles.source}>
              {strings.source}{" "}
              <Link href={data.source} target="_blank" style={styles.source_link}>
                {data.source}
              </Link>
            </Text>
          )}
          <View style={styles.comments}>
            <script
              src="https://utteranc.es/client.js"
              // @ts-ignore
              repo="OzymandiasTheGreat/kitchen.tomasrav.me"
              label="comment"
              theme="preferred-color-scheme"
              crossOrigin="anonymous"
              async
            ></script>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
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
    error: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.content,
      opacity: 0.6,
    },
    error_message: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: theme.size.heading,
    },
    error_cause: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: theme.size.heading * 0.8,
    },
    post: {
      flex: 1,
      alignSelf: "center",
      backgroundColor: theme.colors.content,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: 24,
      paddingVertical: theme.spacing.medium,
      marginVertical: theme.spacing.medium,
      maxWidth: theme.size.container,
      width: "100%",
    },
    meta: {},
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.size.heading,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: theme.spacing.medium,
    },
    tagline: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.medium,
    },
    author: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: theme.size.tagline,
      opacity: 0.6,
    },
    date: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: theme.size.tagline,
      opacity: 0.6,
    },
    markdown: {
      flexGrow: 1,
      color: theme.colors.text,
      fontFamily: theme.fonts.contentRegular,
    },
    source: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bodyRegular,
      fontSize: theme.size.tagline,
      opacity: 0.6,
    },
    source_link: {
      color: theme.colors.link,
    },
    comments: {
      flexGrow: 1,
      minHeight: 256,
    },
  }),
)
