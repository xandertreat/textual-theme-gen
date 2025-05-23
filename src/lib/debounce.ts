type UnknownArgs = unknown[];

class Debounce {
	private callback: (...args: UnknownArgs) => unknown;
	private args: UnknownArgs;
	private delay: number;
	private timer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		callback: (...args: UnknownArgs) => void,
		delay = 0,
		...args: UnknownArgs
	) {
		this.callback = callback;
		this.delay = delay;
		this.args = args;
	}

	refresh(...args: UnknownArgs): this {
		if (args) this.args = args;
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(this.callback.bind(args), this.delay);
		return this;
	}
}

const debounce = (
	callback: (...args: UnknownArgs) => void,
	delay = 0,
	...args: UnknownArgs
) => new Debounce(callback, delay, ...args);

export default debounce;
