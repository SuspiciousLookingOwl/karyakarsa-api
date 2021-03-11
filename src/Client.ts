import EventEmitter from "events";
import Pusher from "pusher-js";
import toCamel from "camelcase-keys";

export interface Donation {
	id: string;
	name: string;
	total: number;
	notes: string;
	createdAt: string;
}

interface ClientEvents {
	donation: (donation: Donation) => void;
}

declare interface Client {
	on<T extends keyof ClientEvents>(event: T, listener: ClientEvents[T]): this;
	once<T extends keyof ClientEvents>(event: T, listener: ClientEvents[T]): this;
	emit<T extends keyof ClientEvents>(event: T, ...args: Parameters<ClientEvents[T]>): boolean;
}

class Client extends EventEmitter {
	streamKey!: string;

	private _pusher!: Pusher;

	private static APP_KEY = "b9efe9fe6c6398eaec9a";

	constructor() {
		super();
	}

	/**
	 * Set the stream key and create websocket connection
	 *
	 * @param streamKey
	 */
	async setStreamKey(streamKey: string): Promise<void> {
		this.streamKey = streamKey;

		this._pusher = new Pusher(Client.APP_KEY, { cluster: "ap1" });
		const channel = this._pusher.subscribe(`activity-${streamKey}`);

		// Event listeners
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		channel.bind("purchase-event", ({ message }: { message: any }) => {
			this.emit("donation", toCamel(message));
		});
	}

	/** Stop */
	disconnect(): void {
		this._pusher.disconnect();
	}
}

export default Client;
