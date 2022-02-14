import React, { useRef } from "react";
import { Image, Text, View } from "react-native";
import {
	A,
	BlockQuote,
	BR,
	Code,
	Del,
	EM,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	HR,
	LI,
	P,
	Strong,
	Table,
	TD,
	TR,
	UL,
} from "@expo/html-elements";
import RenderHTML from "react-native-render-html/src";
// @ts-ignore
import { ghcolors, atomDark } from "react-syntax-highlighter/styles/prism";
import SyntaxHighlighter from "react-native-syntax-highlighter/src";
import type AST from "mdast";
import useTheme, { Theme } from "../pages/_theme";

type Node =
	| AST.Parent
	| AST.Literal
	| AST.Root
	| AST.Paragraph
	| AST.Heading
	| AST.ThematicBreak
	| AST.Blockquote
	| AST.List
	| AST.ListItem
	| AST.HTML
	| AST.Code
	| AST.Definition
	| AST.Text
	| AST.Emphasis
	| AST.Strong
	| AST.InlineCode
	| AST.Break
	| AST.Link
	| AST.Image
	| AST.LinkReference
	| AST.ImageReference
	| AST.FootnoteDefinition
	| AST.FootnoteReference
	| AST.Table
	| AST.TableRow
	| AST.TableCell
	| AST.Delete
	| AST.Footnote;
type NodeProps = {
	definitions: Record<string, string>;
	node: Node;
	theme: typeof Theme["dark"] | null;
};
type MarkdownProps = Omit<NodeProps, "definitions" | "theme">;

const parseImageLabel = (label: string): { width: number; height: number } => {
	const match = [...label.matchAll(/(?<=[\s\-_\.])(\d+?)x(\d+?)$/gm)];
	return {
		width: parseInt(match[0]?.[1]) || 240,
		height: parseInt(match[0]?.[2]) || 180,
	};
};

const getHeadingSlug = (children: AST.PhrasingContent[]): string => {
	const slug = children
		.map((c) => {
			if ("value" in c) {
				return c.value.replace(/\s+/g, "-");
			}
			if ("children" in c) {
				return c.children.map((h) => {
					if ("value" in h) {
						return h.value.replace(/\s/g, "-");
					}
					return "";
				});
			}
			return "";
		})
		.flat();
	return slug.join("-");
};

const getComponent = ({
	definitions,
	node,
	theme,
}: NodeProps): React.FC<any> => {
	switch (node.type) {
		case "root":
			const Root: React.FC = ({ children }) => <>{children}</>;
			return Root;
		case "paragraph":
			const Paragraph: React.FC = ({ children }) => (
				<P style={[theme?.text.body]}>{children}</P>
			);
			return Paragraph;
		case "heading":
			const index = (node as AST.Heading).depth - 1;
			const size = [
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h1multiplier || 1),
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h2multiplier || 0.95),
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h3multiplier || 0.9),
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h4multiplier || 0.85),
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h5multiplier || 0.8),
				(theme?.text.heading.fontSize || 28) *
					(theme?.markdown.heading.h6multiplier || 0.75),
			][index];
			const Component = [H1, H2, H3, H4, H5, H6][index];
			const slug = getHeadingSlug((node as AST.Heading).children);
			const Heading: React.FC = ({ children }) => (
				<Component
					nativeID={slug}
					style={{
						color: theme?.text.heading.color,
						fontFamily:
							theme?.text.heading.fontFamily || "sans-serif",
						fontSize: size,
						marginHorizontal: 0,
						marginTop: 0,
						marginBottom: 20,
					}}>
					<A href={`#${slug}`}>{children}</A>
				</Component>
			);
			return Heading;
		case "thematicBreak":
			const ThematicBreak: React.FC = () => (
				<HR style={[theme?.markdown.hr]}></HR>
			);
			return ThematicBreak;
		case "blockquote":
			const Blockquote: React.FC = ({ children }) => (
				<BlockQuote style={[theme?.markdown.blockquote]}>
					{children}
				</BlockQuote>
			);
			return Blockquote;
		case "list":
			const List: React.FC = ({ children }) => <UL>{children}</UL>;
			return List;
		case "listItem":
			const ListItem: React.FC = ({ children }) => <LI>{children}</LI>;
			return ListItem;
		case "html":
			const HTML: React.FC<{ value: string }> = ({ value }) => (
				<RenderHTML
					source={{ html: value }}
					contentWidth={theme?.markdown.html.contentWidth || 600}
					fallbackFonts={theme?.markdown.html.fallbackFonts}
					defaultTextProps={{
						style: theme?.markdown.html.style,
					}}></RenderHTML>
			);
			return HTML;
		case "code":
			const CodeBlock: React.FC<{ lang: string; value: string }> = ({
				lang,
				value,
			}) => (
				<SyntaxHighlighter
					language={lang || ""}
					fontFamily={theme?.text.code.fontFamily || "monospace"}
					fontSize={theme?.text.code.fontSize || 15}
					highlighter="prism"
					style={theme?.scheme === "dark" ? atomDark : ghcolors}>
					{value}
				</SyntaxHighlighter>
			);
			return CodeBlock;
		case "definition":
			const def = node as AST.Definition;
			definitions[def.identifier] = def.url;
			const Def: React.FC = () => <></>;
			return Def;
		case "text":
			const TextNode: React.FC<{
				value: string;
			}> = ({ value }) => <Text>{value}</Text>;
			return TextNode;
		case "emphasis":
			const Em: React.FC = ({ children }) => (
				<EM style={[{ fontFamily: theme?.text.emphasis.fontFamily }]}>
					{children}
				</EM>
			);
			return Em;
		case "strong":
			const StrongNode: React.FC = ({ children }) => (
				<Strong style={{ fontFamily: theme?.text.strong.fontFamily }}>
					{children}
				</Strong>
			);
			return StrongNode;
		case "inlineCode":
			const InlineCode: React.FC<{ value: string }> = ({ value }) => (
				<Code
					style={{
						fontFamily: theme?.text.code.fontFamily,
						fontSize: theme?.text.code.fontSize || 15,
						backgroundColor: theme?.text.code.backgroundColor,
					}}>
					{value}
				</Code>
			);
			return InlineCode;
		case "break":
			const Break: React.FC = () => <BR>{"\r\n"}</BR>;
			return Break;
		case "link":
			const LinkNode: React.FC<{
				url: string;
			}> = ({ children, url }) => <A href={url}>{children}</A>;
			return LinkNode;
		case "image":
			const img: AST.Image = node as AST.Image;
			const imgDimensions = parseImageLabel(img.alt || "");
			const Img: React.FC<{
				url: string;
			}> = ({ url }) => (
				// eslint-disable-next-line jsx-a11y/alt-text
				<Image
					source={{
						uri: url,
						width: imgDimensions.width,
						height: imgDimensions.height,
					}}
					style={[theme?.markdown.image]}></Image>
			);
			return Img;
		case "linkReference":
			const LinkReference: React.FC<{ identifier: string }> = ({
				children,
				identifier,
			}) => <A href={definitions[identifier] || "#"}>{children}</A>;
			return LinkReference;
		case "imageReference":
			const imageReference: AST.ImageReference =
				node as AST.ImageReference;
			const imgRefDimensions = parseImageLabel(
				imageReference.label || "",
			);
			const ImageReference: React.FC<{ identifier: string }> = ({
				identifier,
			}) => (
				// eslint-disable-next-line jsx-a11y/alt-text
				<Image
					source={{
						uri: definitions[identifier],
						width: imgRefDimensions.width,
						height: imgRefDimensions.height,
					}}
					style={[theme?.markdown.image]}></Image>
			);
			return ImageReference;
		case "footnoteDefinition":
			const FootnoteDefinition: React.FC<{
				identifier: string;
				label: string;
			}> = ({ children, identifier, label }) => (
				<P
					nativeID={`footnote-${identifier}`}
					style={[theme?.markdown.footnote.container]}>
					<A
						href={`#reference-${identifier}`}
						style={[theme?.markdown.footnote.definition]}>
						[{label}]
					</A>
					: {children}
				</P>
			);
			return FootnoteDefinition;
		case "footnoteReference":
			const FootnoteReference: React.FC<{
				identifier: string;
				label: string;
			}> = ({ identifier, label }) => (
				<A
					href={`#footnote-${identifier}`}
					nativeID={`reference-${identifier}`}
					style={[theme?.markdown.footnote.reference]}>
					[{label}]
				</A>
			);
			return FootnoteReference;
		case "table":
			const TableNode: React.FC = ({ children }) => (
				<Table style={[theme?.markdown.table.style]}>{children}</Table>
			);
			return TableNode;
		case "tableRow":
			const TableRow: React.FC = ({ children }) => (
				<TR style={[theme?.markdown.table.row]}>{children}</TR>
			);
			return TableRow;
		case "tableCell":
			const TableCell: React.FC = ({ children }) => (
				<TD style={[theme?.markdown.table.cell]}>
					<Text style={[theme?.markdown.table.text]}>
						{children}
					</Text>
				</TD>
			);
			return TableCell;
		case "delete":
			const Delete: React.FC = ({ children }) => <Del>{children}</Del>;
			return Delete;
		default:
			console.warn("Unhandled node", node.type);
			const Unhandled: React.FC = ({ children }) => <>{children}</>;
			return Unhandled;
	}
};

const Node: React.FC<NodeProps> = ({ definitions, node, theme }) => {
	const Component: React.FC<any> = getComponent({
		definitions,
		node,
		theme,
	});
	const { children } = node as any;

	return children ? (
		<Component {...node}>
			{children.map((child: Node, index: number) => (
				<Node
					key={index}
					definitions={definitions}
					node={child}
					theme={theme}
				/>
			))}
		</Component>
	) : (
		<Component {...node} />
	);
};

export const Markdown: React.FC<MarkdownProps> = ({ node }) => {
	const definitions = useRef<Record<string, string>>({}).current;
	const theme = useTheme();

	return <Node definitions={definitions} node={node} theme={theme} />;
};
