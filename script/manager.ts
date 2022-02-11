import { existsSync, readdirSync, mkdirSync, appendFile } from "fs";

export interface Account {
	username: string,
	email: string,
	password: string,
	plateforme: string,
	site: string,
	pseudo: string,
	note: string
}

export default class FileManager {
	private static _documentPath = `C:/Users/${process.env.USERNAME}/Documents/Manager`;
	public static createFolder(): void {
		if (this.isExisting(this._documentPath))
			return;
		try {
			mkdirSync(this._documentPath);
		} catch (err) {
			console.error(err);
			throw 'Couldn\'t create the folder.';
		}
	}

	public static retrieveAccountTypes(): Array<String> {
		return readdirSync(this._documentPath, {withFileTypes: true})
			.filter(dir => dir.isDirectory())
			.map(dir => dir.name);
	}

	public static addAccountType(type: string): void {
		if (this.isExisting(`${this._documentPath}/${type}`))
			return;
		try {
			mkdirSync(this._documentPath);
		} catch (err) {
			console.error(err);
			throw 'Couldn\'t create the folder.';
		}
	}

	public static createAccountFile(type: string, name: string, accountInformation: Account): Boolean {
		appendFile(`${this._documentPath}/${type}/${name}.json`, JSON.stringify(accountInformation), (err) => {
			if (err) throw 'Couldn\'t create the file.';
		})
		return true;
	}

	private static isExisting(filePath: string): Boolean {
		if (!existsSync(filePath))
			return false;
		return true;
	}
}