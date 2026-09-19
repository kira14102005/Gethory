import { LibraryResponse, SendEmailV3_1 } from "node-mailjet/declarations/types/api"
import resend_client from "../config/resend"
import { EMAIL_SENDER, NODE_ENV } from "../constants/env"
import mailjet from "../config/mailjet"

type Params = {
    to: string,
    subject: string,
    text: string,
    html: string,
}

const getFromEmail = () => {
    return NODE_ENV === 'development' ? "pilot@mailjet.com" : EMAIL_SENDER
}
const getToEmail = (to: string) =>
    NODE_ENV === 'development' ? 'passenger1@mailjet.com' : to
export const sendMail = async ({ to, subject, text, html }: Params) => {


    return await resend_client.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html
    })
}

export const sendMailJet = async ({ to, subject, text, html }: Params) => {

    const request = await mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": getFromEmail(),
                        "Name": "Gethory Team"
                    },
                    "To": [
                        {
                            "Email": getToEmail(to),
                        }
                    ],
                    "Subject": subject,
                    "TextPart": text,
                    "HTMLPart": html
                }
            ]
        })

    return request
}