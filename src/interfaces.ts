export interface AlertDonation {
	id: string;
	name: string;
	total: number;
	notes: string;
	createdAt: string;
}

export interface Donation {
	total: number;
	status: string;
	notes: string | null;
	paymentMethod: string; // can be changed to "ovo" | "dana" etc., need more info.
	duration: number;
	createdAt: string; // Most likely generated from ORM
	updatedAt: string; // Most likely generated from ORM
	supportType: string;
	voucher: string | null;
	voucherValue: number;
	tip: number;
	tierTitle: string;
	userName: string;
	userEmail: string;
}
