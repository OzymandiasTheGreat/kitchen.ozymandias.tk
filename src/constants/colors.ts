export const Colors = {
  light: {
    background: "#FFE082",
    content: "#FAFAFA",
    text: "#424242",
    link: "#2962FF",
  },
  dark: {
    background: "#FF6F00",
    content: "#424242",
    text: "#FAFAFA",
    link: "#82B1FF",
  },
}

export type Colors = (typeof Colors)["dark"] | (typeof Colors)["light"]
