import { relative, sep } from "path";
import klaw from "klaw";
import { POSTSDIR } from "../../constants";
import type { GetStaticProps } from "next";

import React, { useCallback, useEffect, useState } from "react";
import {
	useColorScheme,
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
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
	COLOR_TEXT_BG_DARK,
	COLOR_TEXT_BG_LIGHT,
	COLOR_TEXT_FG_DARK,
	COLOR_TEXT_FG_LIGHT,
	STYLE_REGULAR,
	STYLE_STRONG,
} from "../../theme";

const Archive: React.FC<{ dates: Record<string, string[]> }> = ({ dates }) => {
	const scheme = useColorScheme();
	const [dark, setDark] = useState(false);
	const { lang } = useSelectedLanguage();
	const [header, setHeader] = useState(true);

	useEffect(() => setDark(scheme === "dark"), [scheme]);

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
				.padStart(2, "0")}?lang=${lang}`,
			"_self",
		);
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}>
			<ScrollView
				stickyHeaderIndices={[0]}
				onScroll={headerCallback}
				scrollEventThrottle={100}>
				<Header opaque={header}></Header>
				<View
					style={{
						backgroundColor: dark
							? COLOR_TEXT_BG_DARK
							: COLOR_TEXT_BG_LIGHT,
						flex: 1,
						alignSelf: "center",
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "baseline",
						justifyContent: "space-around",
						width: "80%",
						maxWidth: 800,
						minHeight: 300,
						padding: 50,
						borderRadius: 3,
						marginBottom: 50,
					}}>
					{Object.entries(dates)
						.sort(([a, _], [b, $]) => a.localeCompare(b))
						.map(([month, days]) => {
							const initial = moment.tz(month, "Europe/Vilnius");
							return (
								<View key={month}>
									<Text
										style={[
											STYLE_STRONG,
											{
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontSize: 16,
												alignSelf: "center",
											},
										]}>
										{month}
									</Text>
									<Calendar
										width={300}
										height={260}
										weekdays={
											lang === "lt"
												? [
														"Pr",
														"An",
														"Tr",
														"Kt",
														"Pn",
														"Št",
														"Sk",
												  ]
												: undefined
										}
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
											STYLE_REGULAR,
											{
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontSize: 14,
											},
										]}
										disabledDatesTextStyle={[
											STYLE_REGULAR,
											{
												color: dark
													? COLOR_TEXT_FG_DARK
													: COLOR_TEXT_FG_LIGHT,
												fontSize: 13,
												opacity: 0.3,
											},
										]}
										selectedDayTextColor={
											dark
												? COLOR_TEXT_FG_DARK
												: COLOR_TEXT_FG_LIGHT
										}
										selectedDayStyle={[
											{
												backgroundColor: "transparent",
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
	const dates: Record<string, string[]> = {};
	for await (const { path, stats } of klaw(POSTSDIR, { depthLimit: 3 })) {
		if (stats.isDirectory()) {
			const parts = relative(POSTSDIR, path).split(sep);
			if (parts.length === 2) {
				dates[parts.join("-")] = [];
			} else if (parts.length === 3) {
				dates[parts.slice(0, 2).join("-")].push(parts[2]);
			}
		}
	}
	return { props: { dates } };
};
