import { Resend } from "resend";
import { RESEND_API_KEY } from "../constants/env";

const resend_client = new Resend(RESEND_API_KEY)

export default resend_client;