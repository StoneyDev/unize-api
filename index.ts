import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('API is ready');
});

app.post('/login', (req, res) => {
  if (req.body.email) {
    const token = jwt.sign(
      {
        email: req.body.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
        algorithm: 'RS256',
      }
    );

    const transporter = nodeMailer.createTransport({
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
    });

    const options = {
      from: process.env.NODEMAILER_FROM,
      to: req.body.email,
      subject: 'Se connecter à mon compte Unize',
      html: `<p>Connectez-vous à votre compte dès maintenant: <a href="https://${req.hostname}/authenticate?token=${token}" target="_blank">Se connecter</a><p>`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(200).json({ message: 'Email has been sent successfully' });
    });
  } else {
    res.status(500).json({ message: 'Email field are not define' });
  }
});

app.get('/authenticate', (req, res) => {
  // if (req.query.token) {
  //   try {
  //     const decode = jwt.verify(req.query.token, process.env.JWT_SECRET);
  //     // decode.email
  //     res.cookie('sessionId', sessionId, {secure: true });
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  // } else {
  //   throw new Error('No token found');
  // }
  // res.status(404).end();
});

app.listen(80);
