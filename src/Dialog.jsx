import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

function Dialog(props) {
	const { dialogState, setDialogState, buttonActions } = props;

	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogDesc, setDialogDesc] = useState([]);
	const [dialogButtons, setDialogButtons] = useState([]);

	useEffect(() => {
		if (dialogState == "hint") {
			setDialogTitle("Turn On Hints?");
			setDialogButtons(["Yes", "No"]);
		} else if (dialogState == "info") {
			setDialogTitle("Credits");
			setDialogDesc([
				"Made by [Isabel Lee](https://isabellee.me)",
				"(with help from Keaton Mueller)",
				"Want to report a bug or request a feature? Submit your feedback [here](https://forms.gle/BbLJJp59pQcp9gE3A).",
				"Thanks for playing!",
			]);
			setDialogButtons(["Close"]);
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
