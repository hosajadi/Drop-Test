import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";


@Injectable()
export class EmailSenderService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail", // or your SMTP service
            auth: {
                user: "your@gmail.com", // replace with your Gmail address
                pass: "your-password", // replace with your Gmail password or app-specific password
            },
        });
    }
    async sendEmailUsingGmail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: "test@gmail.com",
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendEmailUsingSMTP(to: string, subject: string, text: string): Promise<void> {
        // Implement sending emails using SMTP
    }
}
