import { join, relative, sep } from "path";
import fs from "fs/promises";
import klaw from "klaw";
import type { GetStaticProps } from "next";

import React, { useCallback, useState } from "react";
import {
	Linking,
	NativeScrollEvent,
	NativeSyntheticEvent,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";
import { useSelectedLanguage } from "next-export-i18n";
import Calendar from "react-native-calendar-picker";
import moment from "moment-timezone";
import useTheme from "../_theme";
import Header from "../../components/header";
import Footer from "../../components/footer";

const Archive: React.FC<{ dates: Record<string, string[]> }> = ({ dates }) => {
	const theme = useTheme();
	const { lang } = useSelectedLanguage();
	const [header, setHeader] = useState(true);

	const headerCallback = useCallback(
		(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (ev.nativeEvent.contentOffset.y <= 100 !== header) {
				setHeader(ev.nativeEvent.contentOffset.y <= 100);
			}
		},
		[header],
	);
	const dateSelector = (
		date: moment.Moment,
		yearmonth: string,
		days: string[],
	): boolean => {
		return !(
			yearmonth ===
				`${date.year()}-${(date.month() + 1)
					.toString()
					.padStart(2, "0")}` &&
			days.includes(date.date().toString().padStart(2, "0"))
		);
	};
	const dateNavigator = (date: moment.Moment) => {
		window.open(
			`/posts/${date.year()}/${(date.month() + 1)
				.toString()
				.padStart(2, "0")}/${date
				.date()
				.toString()
				.padStart(2, "0")}/?lang=${lang}`,
			"_self",
		);
	};

	return (
		<SafeAreaView style={[theme?.main.container]}>
			<ScrollView
				stickyHeaderIndices={[0]}
				onScroll={headerCallback}
				scrollEventThrottle={100}
				style={[theme?.archive.scroller]}>
				<Header opaque={header}></Header>
				<View style={[theme?.archive.container]}>
					{Object.entries(dates)
						.sort(([a, _], [b, $]) => a.localeCompare(b))
						.map(([month, days]) => {
							const initial = moment.tz(month, "Europe/Vilnius");
							return (
								<View key={month}>
									<Text
										style={[
											theme?.text.strong,
											theme?.archive.heading,
										]}>
										{month}
									</Text>
									<Calendar
										width={theme?.archive.width}
										height={theme?.archive.height}
										// @ts-ignore
										initialDate={initial}
										disabledDates={(date) =>
											dateSelector(date, month, days)
										}
										onDateChange={dateNavigator}
										monthYearHeaderWrapperStyle={{
											display: "none",
										}}
										textStyle={[
											theme?.text.body,
											theme?.archive.text,
										]}
										disabledDatesTextStyle={[
											theme?.text.body,
											theme?.archive.disabled,
										]}
										selectedDayTextColor={
											theme?.archive.selectedColor
										}
										selectedDayStyle={[
											{
												backgroundColor:
													theme?.archive
														.selectedBackground,
											},
										]}
										startFromMonday={true}
										previousComponent={<></>}
										nextComponent={<></>}></Calendar>
								</View>
							);
						})}
				</View>
				<Footer></Footer>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Archive;

export const getStaticProps: GetStaticProps = async () => {
	const postsDir = join(process.cwd(), "content/posts");
	const dates: Record<string, string[]> = {};
	for await (const { path, stats } of klaw(postsDir, { depthLimit: 3 })) {
		if (stats.isDirectory()) {
			const parts = relative(postsDir, path).split(sep);
			if (parts.length === 2) {
				dates[parts.join("-")] = [];
			} else if (parts.length === 3) {
				dates[parts.slice(0, 2).join("-")].push(parts[2]);
			}
		}
	}
	return { props: { dates } };
};
