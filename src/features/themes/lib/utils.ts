export const randomName = () => {
	const chars = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0",
	];
	return chars
		.map(() => {
			const char = chars[Math.floor(Math.random() * chars.length)];
			if (Math.random() > 0.5) return char.toUpperCase();
			return char;
		})
		.splice(0, 8)
		.join("");
};
