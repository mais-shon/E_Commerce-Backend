import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to, subject, html) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maisshon104@gmail.com', // generated ethereal user
      pass: 'nohifykdhtdolruk', // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Portrait " <'maisshon104@gmail.com'>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
}

