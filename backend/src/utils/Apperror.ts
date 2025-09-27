import { HTTP } from "../constants/http";

class Apperror extends Error {
    public statusCode: HTTP;

    constructor(s: HTTP, msg: string) {
        super(msg)
        this.statusCode = s;
    }
}


export default Apperror