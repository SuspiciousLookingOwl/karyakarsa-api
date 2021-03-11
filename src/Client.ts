import EventEmitter from "events";
import Pusher from "pusher-js";
import toCamel from "camelcase-keys";
import { AxiosInstance } from "axios";
import { AlertDonation, Donation, Supporter } from "./interfaces";
import axios from "./axios";

interface ClientEvents {
	donation: (donation: AlertDonation) => void;
}

declare interface Client {
	on<T extends keyof ClientEvents>(event: T, listener: ClientEvents[T]): this;
	once<T extends keyof ClientEvents>(event: T, listener: ClientEvents[T]): this;
	emit<T extends keyof ClientEvents>(event: T, ...args: Parameters<ClientEvents[T]>): boolean;
}

class Client extends EventEmitter {
	streamKey!: string;

	private _pusher!: Pusher;
	private _jwt!: string;
	private _axios: AxiosInstance;

	private static APP_KEY = "b9efe9fe6c6398eaec9a";

	constructor() {
		super();
		this._axios = axios;
	}

	/**
	 * Set the stream key and create websocket connection
	 *
	 * @param streamKey
	 */
	setStreamKey(streamKey: string): void {
		this.streamKey = streamKey;
	}

	/** Set JWT. */
	setJWT(jwt: string): void {
		this._jwt = jwt;
		this._axios.defaults.headers.common.authorization = `Bearer ${this._jwt}`;
	}

	/** Logout */
	disconnect(): void {
		this._pusher.disconnect();
		this._jwt = "";
	}

	/** Get user's balance */
	async getBalance(): Promise<number> {
		return (await axios.get("balance")).data;
	}

	/** Get supporter history */
	async getSupportersHistory(page = 1): Promise<Donation[]> {
		return (await axios.get("creator/supporters-history", { params: { page } })).data.data;
	}

	/** Get list of supporters */
	async getSupporters(page = 1): Promise<Supporter[]> {
		return (await axios.get("creator/supporters", { params: { page } })).data.data;
	}

	/** Start event listener */
	run(): void {
		this._pusher = new Pusher(Client.APP_KEY, { cluster: "ap1" });
		const channel = this._pusher.subscribe(`activity-${this.streamKey}`);

		// Event listeners
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		channel.bind("purchase-event", ({ message }: { message: any }) => {
			this.emit("donation", toCamel(message));
		});
	}
}

export default Client;
