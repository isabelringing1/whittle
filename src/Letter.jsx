function Letter(props) {
	const { letter, id, index, onClick } = props;
	return (
		<div className="letter" id={id} onClick={(e) => onClick(index)}>
			{letter}
		</div>
	);
}

export default Letter;
