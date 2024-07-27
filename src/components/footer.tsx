import { StyleSheet, Text, View } from "react-native"
import { Link } from "expo-router"
import { useStrings } from "@/hooks/useStrings"
import { createThemedStylesheet } from "@/hooks/useTheme"

const CC_URL = "https://creativecommons.org/licenses/by/4.0"

export const Footer = () => {
  const styles = useStyle()
  const strings = useStrings()

  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        © {strings.copyright}{" "}
        <Link href={CC_URL} target="_blank" style={styles.link}>
          {strings.license}
        </Link>
      </Text>
    </View>
  )
}

const useStyle = createThemedStylesheet((theme) =>
  StyleSheet.create({
    root: {
      flexShrink: 1,
      backgroundColor: theme.colors.content,
      paddingVertical: theme.spacing.medium,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.size.tagline,
      textAlign: "center",
    },
    link: {
      color: theme.colors.link,
    },
  }),
)
