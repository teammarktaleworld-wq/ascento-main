// import nodemailer from "nodemailer";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "mail.ascentoabacus.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "info@ascentoabacus.com",
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.verify();

//     await transporter.sendMail({
//       from: "info@ascentoabacus.com",
//       to: "apatil9399273310@gmail.com",
//       subject: "SMTP Test",
//       text: "Hello! SMTP is working.",
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Email sent successfully",
//     });
//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       error: error.message,
//     });
//   }
// }







// export async function GET() {
//   return Response.json({
//     success: true,
//     message: "API route is working",
//   });
// }










import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.ascentoabacus.com",
      port: 465,
secure: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: "info@ascentoabacus.com",
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    return NextResponse.json({
      success: true,
      message: "SMTP connection successful",
    });
  } catch (error: any) {
    console.error("SMTP ERROR:", error);

    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
}