---
title:   "Testing"
publish: 2022-02-12T11:53:40+0200
edited:  2022-02-13T05:37:10+0200
tags:    test markdown
---

# Heading h1
## Heading h2
### Heading h3
#### Heading h4
##### Heading h5
###### Heading h6


And a footnote. [^1]


This is paragraph 1. I'm just writing whatever to test how it looks.
I slept well tonight, thank you very much. I'm gonna code all day
after taking a shower. My "breakfast" will be way in the afternoon.

This is paragraph 2. I'll work on my food/kitchen blog. If I finish early,
I'll work on my technology blog. Probably not though, there's a lot to do.
See y'all later.

Yet another paragraph with `inline code`. I'll have to rewrite `frontmatter`
on all my posts, but I'll make them prettier, `with more meta data`.
Next paragraph will be a code block!

```tsx
const Post: React.FC<{ matter: PostMatter; content: Root }> = ({
	matter,
	content,
}) => {
	useFonts({
		fira: FiraCode_400Regular,
		fira_bold: FiraSansCondensed_700Bold,
		fira_italic: FiraSansCondensed_400Regular_Italic,
		fira_code: FiraCode_400Regular,
	});
	const theme = useTheme();
	console.log(content);

	return (
		<View style={{ flex: 1, alignItems: "center" }}>
			<View
				style={{
					width: "80%",
					maxWidth: 800,
					backgroundColor: "#efefef",
					borderRadius: 15,
					paddingVertical: 20,
					paddingHorizontal: 45,
				}}>
				<Markdown
					node={content}
					fontSize={18}
					fonts={{
						regular: "fira",
						bold: "fira_bold",
						italic: "fira_italic",
						code: "fira_code",
					}}></Markdown>
			</View>
		</View>
	);
};
```

---

> This is a blockquote
> A second line
>> Nested


- This
- is
- a
- list
	- sublist
	- more


<h1>Hello, World!</h1>
<p align="left">
<a href="https://dev.to/ozymandiasthegreat" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/devto.svg" alt="ozymandiasthegreat" height="30" width="40" /></a>
<a href="https://stackoverflow.com/users/ozymandias" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/stack-overflow.svg" alt="ozymandias" height="30" width="40" /></a>
<a href="https://fb.com/ozymandiasthegreat" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/facebook.svg" alt="ozymandiasthegreat" height="30" width="40" /></a>
<a href="https://medium.com/@ozymandiasthegreat" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/medium.svg" alt="@ozymandiasthegreat" height="30" width="40" /></a>
</p>


[alpha][Bravo]
![delta][Gamma]

[Bravo]: https://example.com
[Gamma]: https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/devto.svg


*Italics, byatch!*


**And bolds too!**


New
lines!


[Another link](https://example.com)


![Plain Image](https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/medium.svg)


[^1]: If I get this working, amazeballs.


**This** | **is** | **a** | **table**
---------|-------|-------|------
Another  | row  | here  | 😄


~~Strike through text~~
