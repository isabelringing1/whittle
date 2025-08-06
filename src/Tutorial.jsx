import { useState, useEffect } from "react";
import Letter from "./Letter";

function Tutorial(props) {
	const { setShowTutorial } = props;

	const [currentAnimation, setCurrentAnimation] = useState(null);
	const [tutorialPage, setTutorialPage] = useState(0);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	// the required distance between touchStart and touchEnd to be detected as a swipe
	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;
		if (isLeftSwipe) {
			onTutorialPressed();
		}
		if (isRightSwipe) {
			tutorialBack();
		}
	};

	var firstTutorialPhrase = "cart";
	var secondTutorialPhrase = "spa red";
	var thirdTutorialPhrase = "skin";

	useEffect(() => {
		setTutorialPage(0);
	}, []);

	useEffect(() => {
		var currPage = document.getElementById("tutorial-page-" + tutorialPage);
		if (tutorialPage == 0) {
			animateFirstTutorial();
		} else if (tutorialPage == 1) {
			animateSecondTutorial();
		} else if (tutorialPage == 2) {
			animateThirdTutorial();
		}
	}, [tutorialPage]);

	const animateFirstTutorial = () => {
		var lettersContainer = document.getElementById(
			"tutorial-letter-container-1"
		);
		var c = document.getElementById("tutorial-letter-0-0");
		var r = document.getElementById("tutorial-letter-0-2");
		var t = document.getElementById("tutorial-letter-0-3");

		var interval = setInterval(
			(function animation() {
				c.classList.remove("disappear");
				r.classList.remove("disappear");
				t.classList.remove("disappear");

				setTimeout(() => {
					c.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 500);

				setTimeout(() => {
					r.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 1500);

				setTimeout(() => {
					t.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 2500);
				return animation;
			})(),
			4000
		);
		setCurrentAnimation(interval);
	};

	const animateSecondTutorial = () => {
		var lettersContainer = document.getElementById(
			"tutorial-letter-container-2"
		);
		var space = document.getElementById("tutorial-letter-1-3");

		var interval = setInterval(
			(function animation() {
				space.classList.remove("disappear");

				setTimeout(() => {
					space.classList.add("disappear");
					space.style.transition =
						"padding 0.1s ease-in, transform 0.1s ease-in, width 0.1s ease-in";
					setTimeout(() => {
						space.style.transition = "none";
						lettersContainer.classList.add("purple");
						setTimeout(() => {
							lettersContainer.classList.remove("purple");
						}, 300);
					}, 300);
				}, 500);

				return animation;
			})(),
			2000
		);
		setCurrentAnimation(interval);
	};

	const animateThirdTutorial = () => {
		var lettersContainer = document.getElementById(
			"tutorial-letter-container-3"
		);
		var s = document.getElementById("tutorial-letter-2-0");
		var k = document.getElementById("tutorial-letter-2-1");
		var i = document.getElementById("tutorial-letter-2-2");
		var n = document.getElementById("tutorial-letter-2-3");

		var interval = setInterval(
			(function animation() {
				s.classList.remove("disappear");
				k.classList.remove("disappear");
				i.classList.remove("disappear");
				n.classList.remove("disappear");

				setTimeout(() => {
					s.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 500);

				setTimeout(() => {
					k.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 1500);

				setTimeout(() => {
					n.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 2500);

				setTimeout(() => {
					i.classList.add("disappear");
					setTimeout(() => {
						lettersContainer.classList.add("green");
						setTimeout(() => {
							lettersContainer.classList.remove("green");
						}, 300);
					}, 300);
				}, 3500);
				return animation;
			})(),
			5500
		);
		setCurrentAnimation(interval);
	};

	const onTutorialPressed = () => {
		if (tutorialPage < 2) {
			setTutorialPage(tutorialPage + 1);
		} else {
			setShowTutorial(false);
		}
	};

	const tutorialBack = () => {
		if (tutorialPage > 0) {
			setTutorialPage(tutorialPage - 1);
		}
	};

	const progressContainer = (
		<div id="tutorial-progress-container">
			<div
				className={
					"tutorial-progress-circle " +
					(tutorialPage == 0 ? "filled" : "")
				}
				id="tutorial-progress-circle-0"
			></div>
			<div
				className={
					"tutorial-progress-circle " +
					(tutorialPage == 1 ? "filled" : "")
				}
				id="tutorial-progress-circle-1"
			></div>
			<div
				className={
					"tutorial-progress-circle " +
					(tutorialPage == 2 ? "filled" : "")
				}
				id="tutorial-progress-circle-2"
			></div>
		</div>
	);

	return (
		<div
			className="tutorial-container"
			onClick={onTutorialPressed}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			<div
				className={
					"tutorial-page " + (tutorialPage == 0 ? "" : "hidden")
				}
				id="tutorial-page-0"
			>
				<div className="tutorial-title"> How to Play </div>
				<div className="tutorial-text">
					Remove <b>one letter</b> each turn by tapping on it.
				</div>
				<div
					className="tutorial-letter-container"
					id="tutorial-letter-container-1"
				>
					{firstTutorialPhrase.split("").map((letter, i) => {
						return (
							<Letter
								key={"tutorial-letter-0-" + i}
								id={"tutorial-letter-0-" + i}
								index={i}
								letter={letter}
								onClick={() => {}}
								noninteractable={true}
							/>
						);
					})}
				</div>
				<div className="tutorial-text">
					Watch out! The remaining words must still be <b>valid</b>.
				</div>
				{progressContainer}
			</div>
			<div
				className={
					"tutorial-page " + (tutorialPage == 1 ? "" : "hidden")
				}
				id="tutorial-page-1"
			>
				<div className="tutorial-title"> How to Play </div>
				<div className="tutorial-text">
					You can combine words by removing a <b>space</b>.
				</div>
				<div
					className="tutorial-letter-container"
					id="tutorial-letter-container-2"
				>
					{secondTutorialPhrase.split("").map((letter, i) => {
						return (
							<Letter
								key={"tutorial-letter-1-" + i}
								id={"tutorial-letter-1-" + i}
								index={i}
								letter={letter}
								onClick={() => {}}
								noninteractable={true}
							/>
						);
					})}
				</div>
				{progressContainer}
			</div>
			<div
				className={
					"tutorial-page " + (tutorialPage == 2 ? "" : "hidden")
				}
				id="tutorial-page-2"
			>
				<div className="tutorial-title"> How to Play </div>
				<div className="tutorial-text">
					Whittle the words down to <b>nothing</b> to win!
				</div>
				<div
					className="tutorial-letter-container"
					id="tutorial-letter-container-3"
				>
					{thirdTutorialPhrase.split("").map((letter, i) => {
						return (
							<Letter
								key={"tutorial-letter-2-" + i}
								id={"tutorial-letter-2-" + i}
								index={i}
								letter={letter}
								onClick={() => {}}
								noninteractable={true}
							/>
						);
					})}
				</div>
				<div className="tutorial-text">
					Can you find all possible words today?
				</div>
				{progressContainer}
			</div>
		</div>
	);
}

export default Tutorial;
