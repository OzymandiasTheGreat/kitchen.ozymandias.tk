import type { Root } from "mdast";
import type { JsonValue } from "type-fest";

export interface Serializable {
	[x: string]: Root | JsonValue | undefined;
}

export interface PostMatter extends Serializable {
	title: string;
	publish: string;
	edited: string | null;
	tags: string[];
	excerpt?: Root;
	content?: Root;
	image: {
		uri: string;
		copyright: string;
	} | null;
	source: string | null;
}

export interface Post {
	[lang: string]: PostMatter;
}
