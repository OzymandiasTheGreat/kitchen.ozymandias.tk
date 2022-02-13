import React, { useRef } from "react";
import { Image, Text, View } from "react-native";
import {
	A,
	BlockQuote,
	BR,
	Code,
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
	S,
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
				<P
					style={{
						color: theme?.text.color,
						fontFamily: theme?.text.fontFamily || "sans-serif",
						fontSize: theme?.text.fontSize,
						marginHorizontal: 0,
						marginTop: 0,
						marginBottom: 20,
					}}>
					{children}
				</P>
			);
			return Paragraph;
		case "heading":
			const index = (node as AST.Heading).depth - 1;
			const size = [
				(theme?.text.fontSize || 18) + 10,
				(theme?.text.fontSize || 18) + 8,
				(theme?.text.fontSize || 18) + 6,
				(theme?.text.fontSize || 18) + 4,
				(theme?.text.fontSize || 18) + 2,
				theme?.text.fontSize || 18,
			][index];
			const Component = [H1, H2, H3, H4, H5, H6][index];
			const slug = getHeadingSlug((node as AST.Heading).children);
			const Heading: React.FC = ({ children }) => (
				<Component
					nativeID={slug}
					style={{
						color: theme?.heading.color,
						fontFamily: theme?.heading.fontFamily || "sans-serif",
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
				<HR
					style={{
						width: "90%",
						backgroundColor: theme?.text.color,
					}}></HR>
			);
			return ThematicBreak;
		case "blockquote":
			const Blockquote: React.FC = ({ children }) => (
				<BlockQuote style={[theme?.blockquote]}>{children}</BlockQuote>
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
					contentWidth={theme?.html.contentWidth || 600}
					fallbackFonts={theme?.html.fallbackFont}
					defaultTextProps={{
						style: theme?.html.props,
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
					fontFamily={theme?.text.fontCode || "monospace"}
					fontSize={
						(theme?.text.fontSize || 18) *
						(theme?.code.fontSizeMultiplier || 0.9)
					}
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
				<EM style={{ fontFamily: theme?.text.fontItalic }}>
					{children}
				</EM>
			);
			return Em;
		case "strong":
			const StrongNode: React.FC = ({ children }) => (
				<Strong style={{ fontFamily: theme?.text.fontBold }}>
					{children}
				</Strong>
			);
			return StrongNode;
		case "inlineCode":
			const InlineCode: React.FC<{ value: string }> = ({ value }) => (
				<Code
					style={{
						fontFamily: theme?.text.fontCode,
						fontSize:
							(theme?.text.fontSize || 18) *
							(theme?.code.fontSizeMultiplier || 0.9),
						backgroundColor: theme?.code.backgroundColor,
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
					resizeMode="contain"></Image>
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
					resizeMode="contain"></Image>
			);
			return ImageReference;
		case "footnoteDefinition":
			const FootnoteDefinition: React.FC<{
				identifier: string;
				label: string;
			}> = ({ children, identifier, label }) => (
				<P
					nativeID={`footnote-${identifier}`}
					style={{
						color: theme?.text.color,
						fontFamily: theme?.text.fontFamily || "sans-serif",
						fontSize: (theme?.text.fontSize || 18) - 4,
						opacity: 0.7,
						marginHorizontal: 0,
						marginTop: 0,
						marginBottom: 15,
					}}>
					<A
						href={`#reference-${identifier}`}
						style={{
							fontSize: (theme?.text.fontSize || 18) - 4,
							position: "relative",
							top: -(theme?.text.fontSize || 18) / 2,
						}}>
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
					style={{
						fontSize: (theme?.text.fontSize || 18) - 8,
						position: "relative",
						top: -(theme?.text.fontSize || 18) / 2,
					}}>
					[{label}]
				</A>
			);
			return FootnoteReference;
		case "table":
			const TableNode: React.FC = ({ children }) => (
				<Table
					style={{
						alignSelf: "flex-start",
						borderColor: theme?.text.color,
						borderWidth: 2,
						marginBottom: 45,
					}}>
					{children}
				</Table>
			);
			return TableNode;
		case "tableRow":
			const TableRow: React.FC = ({ children }) => (
				<TR style={{ borderColor: theme?.text.color, borderWidth: 2 }}>
					{children}
				</TR>
			);
			return TableRow;
		case "tableCell":
			const TableCell: React.FC = ({ children }) => (
				<TD
					style={{
						paddingVertical: 5,
						paddingHorizontal: 10,
						borderColor: theme?.text.color,
						borderWidth: 2,
					}}>
					<Text
						style={{
							color: theme?.text.color,
							fontFamily: theme?.text.fontFamily,
							fontSize: theme?.text.fontSize,
						}}>
						{children}
					</Text>
				</TD>
			);
			return TableCell;
		case "delete":
			const Delete: React.FC = ({ children }) => <S>{children}</S>;
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
