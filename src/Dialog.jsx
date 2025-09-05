import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

function Dialog(props) {
	const { dialogState, setDialogState, buttonActions } = props;

	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogDesc, setDialogDesc] = useState([]);
	const [dialogButtons, setDialogButtons] = useState([]);

	const betaClickCounter = useRef(0);

	useEffect(() => {
		if (dialogState == "hint") {
			setDialogTitle("Turn On Hints?");
			setDialogButtons(["Yes", "No"]);
		} else if (dialogState == "info") {
			setDialogTitle("Credits");
			setDialogDesc([
				"Made by [Isabel Lee](https://isabellee.me)",
				"Want to report a bug or request a feature? Submit your [feedback](https://forms.gle/BbLJJp59pQcp9gE3A).",
				"Special thanks to Keaton Mueller & all beta testers!",
			]);
			setDialogButtons(["Close"]);
		} else if (dialogState == "beta") {
			setDialogTitle("Enable Beta?");
			setDialogDesc(["You'll be able to play tomorrow's puzzle."]);
			setDialogButtons(["Yes", "No"]);
		}
	}, [dialogState]);

	const onDialogPressed = (e) => {
		if (e.target.className != "dialog-container") {
			return;
		}
		setDialogState("none");
	};

	return (
		<div className="dialog-container" onClick={onDialogPressed}>
			<div className={"dialog-page"}>
				<div className="dialog-title">{dialogTitle}</div>
				{dialogDesc.map((text, i) => {
					return (
						<div
							className={"dialog-text dialog-" + dialogState}
							key={"dialog-text-" + i}
							onClick={() => {
								if (text.includes("beta")) {
									betaClickCounter.current++;
									if (betaClickCounter.current == 10) {
										setDialogState("beta");
									}
								}
							}}
						>
							<Markdown>{text}</Markdown>
						</div>
					);
				})}
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
