

export class Merchant {
    id: string;
    name: string;
    categories: string;
    code: number;

    constructor(id: string, name: string, categories: string, code: number) {
        this.id = id;
        this.name = name;
        this.categories = categories;
        this.code = code;
    }
}
