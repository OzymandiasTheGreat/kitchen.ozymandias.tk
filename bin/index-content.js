const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const PAGE_SIZE = 10

const root = path.resolve(__dirname, "..", "public/content")
const languages = fs
  .readdirSync(root)
  .map((folderPath) => path.basename(folderPath))
  .filter((filename) => filename.length === 2)

for (const lang of languages) {
  const content = []

  for (const filename of fs.readdirSync(path.join(root, lang))) {
    if (filename.endsWith(".md")) {
      const data = matter(fs.readFileSync(path.join(root, lang, filename))).data
      content.push({ ...data, filename })
    }
  }

  const pages = content
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .reduce((acc, post, index) => {
      const chunk = Math.floor(index / PAGE_SIZE)
      acc[chunk] = [].concat(acc[chunk] ?? [], post)
      return acc
    }, [])

  for (let i = 0; i < pages.length; i++) {
    const last = i === pages.length - 1
    const page = {
      last,
      content: pages[i],
    }
    const filename = path.join(root, `${lang}-` + `${i}`.padStart(4, "0") + ".json")
    fs.writeFileSync(filename, JSON.stringify(page, null, 2))
  }
}
