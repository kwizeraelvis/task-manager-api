const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

sgMail.setApiKey('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');

const sendwelcomeEmail = async (email, name) => {
 try {
  await sgMail.send({
   to:email,
   from: 'kwizeraelvis6@gmail.com',
   subject: 'Tanks for using myapp',
   text: `Welcome to the app, ${name}. Let me Know how the app is moving along`
  })
 } catch (e) {
  console.log(e);
 }

};

const sendCancellationEmail = async (email, name) => {
 try {
  await sgMail.send({
   to: email,
   from: 'kwizeraelvis6@gmail.com',
   subject: `Cancellation Email`,
   text: `Hello ${name}, I saw yor cancellation email and wanted to ask what would have caused your cancellation`
  })
 } catch (e) {
  console.log(e);
 }

};

module.exports = {
 sendwelcomeEmail, sendCancellationEmail
};
