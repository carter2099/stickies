export class MyService {

    constructor() {
    }

    async helloWorld(): Promise<string> {
        console.log("Hello World!");
        return "Hello World!";
    }

} 