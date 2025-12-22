import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import changelogData from "/data/changelog.txt";

function Dialog(props) {
	const { dialogState, setDialogState, buttonActions } = props;

	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogDesc, setDialogDesc] = useState([]);
	const [dialogButtons, setDialogButtons] = useState([]);
	const [changelog, setChangelog] = useState([]);

	const betaClickCounter = useRef(0);

	useEffect(() => {
		if (dialogState == "hint") {
			setDialogTitle("Turn On Hints?");
			setDialogButtons(["Yes", "No"]);
		} else if (dialogState == "info") {
			setDialogTitle("Credits");
			setDialogDesc([
				"Made by [Isabel Lee](https://isabisabel.com)",
				"Want to report a bug or request a feature? Submit your [feedback](https://forms.gle/BbLJJp59pQcp9gE3A).",
				"Special thanks to Keaton Mueller & all beta testers!",
			]);
			setDialogButtons(["Close"]);
		} else if (dialogState == "beta") {
			setDialogTitle("Enable Beta?");
			setDialogDesc(["You'll be able to play tomorrow's puzzle."]);
			setDialogButtons(["Yes", "No"]);
		} else if (dialogState == "changelog") {
			if (changelog.length == 0) {
				setChangelogDescAsync();
			}
			setDialogTitle("Changelog");
		} else if (dialogState == "beta-archive-solve") {
			setDialogTitle("Cheat Solve?");
			setDialogDesc(["Don't abuse this..."]);
			setDialogButtons(["Yes", "No"]);
		}
	}, [dialogState]);

	const onDialogPressed = (e) => {
		if (e.target.className != "dialog-container") {
			return;
		}
		setDialogState("none");
	};

	const setChangelogDescAsync = async () => {
		try {
			const changelogResponse = await fetch(changelogData);
			const changelogText = await changelogResponse.text();
			var changes = changelogText.split("#").filter((w) => w.length != 0);
			setChangelog(changes);
			var newDialogDesc = [];
			for (var i in changes) {
				var changeArray = changes[i]
					.split("\n")
					.filter((w) => w.length != 0);
				console.log(changeArray);
				newDialogDesc.push("**" + changeArray[0] + "**");
				for (var j = 1; j < changeArray.length; j++) {
					newDialogDesc.push(changeArray[j]);
				}
			}
			setDialogDesc(newDialogDesc);
		} catch (error) {
			console.error("Error loading data:", error);
		}
	};

	return (
		<div className="dialog-container" onClick={onDialogPressed}>
			<div className={"dialog-page"}>
				<div className="dialog-title">{dialogTitle}</div>
				<div
					className={
						"dialog-text-container dialog-container-" + dialogState
					}
				>
					{dialogDesc.map((text, i) => {
						var cn = "dialog-text dialog-" + dialogState;
						return (
							<div
								className={cn}
								key={"dialog-text-" + i}
								onClick={() => {
									if (text.includes("beta")) {
										betaClickCounter.current++;
										if (betaClickCounter.current == 10) {
											setDialogState("beta");
										}
									} else if (text.includes("changelog")) {
										setDialogState("changelog");
									}
								}}
							>
								<Markdown>{text}</Markdown>
							</div>
						);
					})}
				</div>
				<div className="dialog-buttons-container">
					{dialogButtons.map((text, i) => {
						return (
							<button
								className="dialog-button"
								key={"dialog-buttons-" + i}
								onClick={buttonActions[i]}
							>
								<div className="dialog-button-text-container">
									{text}
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Dialog;
