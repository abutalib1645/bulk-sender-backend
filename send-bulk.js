const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/send-bulk", async (req, res) => {
  const { smtpAccounts, emails, subject, body } = req.body;
  let success = 0, failed = 0, index = 0;

  for (const email of emails) {
    const smtp = smtpAccounts[index % smtpAccounts.length];
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass }
    });

    try {
      await transporter.sendMail({
        from: smtp.user,
        to: email,
        subject,
        html: body
      });
      success++;
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err.message);
      failed++;
    }

    index++;
  }

  res.json({ success, failed });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});