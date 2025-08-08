import { useState, useEffect, useRef } from "react";

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
			//setDialogTitle("Info");
			setDialogDesc([
				"Credits",
				"Made by Isabel Lee",
				"with help from Keaton Mueller",
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
							{text}
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
