import nodemailer from "nodemailer";
import { NODEMAILER_CREDS } from "./constants";

const emailService = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: NODEMAILER_CREDS.EMAIL,
        pass: NODEMAILER_CREDS.PASSWORD,
    },
});



export default emailService