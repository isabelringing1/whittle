import { useState, useEffect } from "react";

import { getStatusClassName, getDateString } from "../public/util";

import "./Archive.css";

import checkmark from "/images/checkmark.png";

function Day(props) {
	const { date, data, onDayClicked, isToday, hasPuzzle } = props;
	const [dayClass, setDayClass] = useState("day");
	const [dayContainerClass, setDayContainerClass] = useState("day");

	useEffect(() => {
		setDefaultDayClass();
	}, [data, date]);

	const setDefaultDayClass = () => {
		var newDayClass = "day ";
		var newDayContainerClass = "day-container ";
		var percentFound = data != null ? data.percentFound : -1;

		if (percentFound != -1 && percentFound != undefined) {
			newDayClass += "archive-" + getStatusClassName(percentFound) + " ";
		}
		if (!hasPuzzle) {
			newDayClass += "inactive ";
		}

		if (data != null && data.completedToday) {
			newDayClass += "gold-border ";
		}
		setDayClass(newDayClass);
		setDayContainerClass(newDayContainerClass);
	};

	return (
		<div className={dayContainerClass}>
			<div className={"archive-date-text " + (isToday ? "today" : "")}>
				{date.getDate()}
			</div>
			<div
				className={dayClass}
				id={"day-" + getDateString(date)}
				onClick={() => {
					if (!hasPuzzle) {
						return;
					}

					onDayClicked(date);
				}}
			>
				{data && data.solved && (
					<img src={checkmark} className="archive-checkmark-img" />
				)}
			</div>
		</div>
	);
}

export default Day;
