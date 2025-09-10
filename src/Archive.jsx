import { useState, useEffect, useRef } from "react";

import {
	getDateString,
	getDateStringFormatted,
	getStatusClassName,
} from "../public/util";

import Day from "./Day";

import arrow from "/images/small_arrow.png";

import "./Archive.css";

function Archive(props) {
	const {
		dailyPuzzleDict,
		puzzleLog,
		playerData,
		setPrevGameState,
		setGameState,
		setCurrentPuzzleId,
		setIsArchivePuzzle,
		setIsTomorrowsPuzzle,
		dailyPuzzleId,
		setCurrentDebugPuzzlePhrase,
		lastSelectedArchiveDate,
		setLastSelectedArchiveDate,
	} = props;

	const [currentDate, setCurrentDate] = useState(null); //month day year
	const [firstPuzzleDate, setFirstPuzzleDate] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		console.log(lastSelectedArchiveDate);
		if (lastSelectedArchiveDate != null) {
			setCurrentDate(lastSelectedArchiveDate);
		} else {
			var date = new Date();
			setCurrentDate([
				date.getMonth(),
				date.getDate(),
				date.getFullYear(),
			]);
		}
	}, []);

	useEffect(() => {
		if (
			dailyPuzzleDict == null ||
			Object.keys(dailyPuzzleDict).length === 0
		) {
			return;
		}
		var dateArray = Object.keys(dailyPuzzleDict)[0].split("/");
		setFirstPuzzleDate(
			new Date(
				parseInt(dateArray[2]),
				parseInt(dateArray[0]),
				parseInt(dateArray[1])
			)
		);
	}, [dailyPuzzleDict]);

	useEffect(() => {
		if (selectedDate != null) {
			setCurrentPuzzleId(getDateString(selectedDate));
			setCurrentDebugPuzzlePhrase(null);
			setIsArchivePuzzle(getDateString(selectedDate) != dailyPuzzleId);
			setIsTomorrowsPuzzle(selectedDate >= new Date());
		}
	}, [selectedDate]);

	function getDateArray(month, year) {
		// returns the dates in a certain month and year
		var dateArray = [];
		var firstDay = new Date(year, month, 1).getDay();
		for (var i = 0; i < firstDay; i++) {
			dateArray.push(null);
		}
		var daysInMonth = new Date(year, month + 1, 0).getDate(); //hack

		for (var i = 1; i <= daysInMonth; i++) {
			var d = new Date(year, month, i);
			dateArray.push(d);
		}
		return dateArray;
	}

	const canClickBackArrow = () => {
		if (currentDate == null) {
			return false;
		}
		// check if first puzzle date is higher than first of month but less than last of month, then you can't
		var firstDay = new Date(currentDate[2], currentDate[0], 1);
		var lastDay = new Date(currentDate[2], currentDate[0] + (1 % 12), 0);
		return !(firstPuzzleDate >= firstDay && firstPuzzleDate <= lastDay);
	};

	const canClickForwardArrow = () => {
		if (currentDate == null) {
			return false;
		}
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var compDate = new Date(
			currentDate[2],
			currentDate[0],
			today.getDate()
		);
		return compDate < today;
	};

	const onBackArrowClicked = () => {
		if (!canClickBackArrow()) {
			return;
		}
		var yearOffset = currentDate[0] == 0 ? -1 : 0;
		var month = currentDate[0] == 0 ? 11 : currentDate[0] - 1;
		var date = [month, 0, currentDate[2] + yearOffset];
		setCurrentDate(date);
		setLastSelectedArchiveDate(date);
	};

	const onForwardArrowClicked = () => {
		if (!canClickForwardArrow()) {
			return;
		}
		var yearOffset = currentDate[0] == 11 ? 1 : 0;

		var date = [(currentDate[0] + 1) % 12, 0, currentDate[2] + yearOffset];
		setCurrentDate(date);
		setLastSelectedArchiveDate(date);
	};

	const getCurrentMonthName = () => {
		if (currentDate == null) {
			return "";
		}
		return new Date(currentDate[2], currentDate[0], 1).toLocaleString(
			"default",
			{
				month: "long",
			}
		);
	};

	const onDayClicked = (date) => {
		setSelectedDate(date);
	};

	const onSelectedDateContainerClicked = () => {
		setSelectedDate(null);
	};

	const onStartButtonClicked = () => {
		setPrevGameState("archive");
		setGameState("play");
	};

	const getCurrentMonth = () => {
		if (currentDate == null) {
			return "";
		}
		return currentDate[0];
	};

	const getCurrentDay = () => {
		if (currentDate == null) {
			return "";
		}
		return currentDate[1];
	};

	const getCurrentYear = () => {
		if (currentDate == null) {
			return "";
		}
		return currentDate[2];
	};

	const isBetaTester = () => {
		return playerData && playerData.betaTester;
	};

	const getTomorrowDate = () => {
		const newDate = new Date();
		newDate.setHours(newDate.getHours() + 24);
		return newDate;
	};

	return (
		<div id="archive">
			{selectedDate && (
				<div
					id="selected-day-container"
					onClick={onSelectedDateContainerClicked}
				>
					<div id="selected-day-menu">
						<div className="selected-day-title">
							{getDateStringFormatted(selectedDate)}
						</div>
						<div className="selected-day-subtitle">
							Whittle #
							{
								dailyPuzzleDict[getDateString(selectedDate)]
									.number
							}
						</div>
						<div id="selected-day-menu-body">
							<button
								id="start-button-archive"
								className={
									"continue-" +
									(puzzleLog != undefined &&
									puzzleLog != null &&
									getStatusClassName(
										puzzleLog[getDateString(selectedDate)]
									)
										? puzzleLog[getDateString(selectedDate)]
												.percentFound
										: 0)
								}
								onMouseUp={() => onStartButtonClicked()}
								onTouchEnd={() => onStartButtonClicked()}
							>
								<div className="button-container">
									{puzzleLog == undefined ||
									!puzzleLog ||
									!puzzleLog[getDateString(selectedDate)] ||
									puzzleLog[getDateString(selectedDate)]
										.percentFound == 0
										? "Start"
										: "Continue"}
								</div>
							</button>
							{puzzleLog != undefined &&
								puzzleLog != null &&
								puzzleLog[getDateString(selectedDate)] &&
								puzzleLog[getDateString(selectedDate)]
									.percentFound > 0 && (
									<div id="percent-complete-info-archive">
										You've found{" "}
										<b>
											{
												puzzleLog[
													getDateString(selectedDate)
												].percentFound
											}
											%
										</b>{" "}
										of all words
									</div>
								)}
						</div>
					</div>
				</div>
			)}

			<div id="calendar">
				<div id="calendar-header">
					<img
						src={arrow}
						id="left-arrow"
						className={
							"arrow " + (canClickBackArrow() ? "" : "disabled")
						}
						onClick={onBackArrowClicked}
					/>

					<div id="month-name">
						{getCurrentMonthName()} {getCurrentYear()}
					</div>
					<img
						src={arrow}
						id="right-arrow"
						className={
							"arrow " +
							(canClickForwardArrow() ? "" : "disabled")
						}
						onClick={onForwardArrowClicked}
					/>
				</div>
				<div id="days-array">
					{currentDate &&
						getDateArray(getCurrentMonth(), getCurrentYear()).map(
							(date, i) => {
								if (date == null) {
									return (
										<div
											key={"day-" + i}
											className="empty-day"
										></div>
									);
								}
								return (
									<Day
										key={"day-" + i}
										date={date}
										data={
											puzzleLog &&
											puzzleLog[getDateString(date)]
										}
										onDayClicked={onDayClicked}
										isToday={
											getDateString(date) == dailyPuzzleId
										}
										hasPuzzle={
											(date <= Date.now() &&
												dailyPuzzleDict[
													getDateString(date)
												] != null) ||
											(isBetaTester() &&
												date <= getTomorrowDate() &&
												dailyPuzzleDict[
													getDateString(date)
												] != null)
										}
									/>
								);
							}
						)}
				</div>
			</div>
		</div>
	);
}

export default Archive;
