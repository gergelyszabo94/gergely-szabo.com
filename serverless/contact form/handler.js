const aws = require('aws-sdk');
const request = require('request');
const ses = new aws.SES();
const source_email = process.env.SOURCE_EMAIL;
const destination_email = process.env.DESTINATION_EMAIL;
const myDomain = process.env.DOMAIN;
const hcaptcha_secret = process.env.HCAPTCHA_SECRET;
const hcaptcha_site_key = process.env.HCAPTCHA_SITE_KEY;

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams (body) {
  const { email, name, content } = JSON.parse(body);
  console.log(email, name, content);
  if (!(email && name && content)) {
    throw new Error('Missing parameters! Make sure to add parameters \'email\', \'name\', \'content\'.')
  }

  return {
    Source: source_email,
    Destination: { ToAddresses: [destination_email] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${name} \nContent: ${content}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Website Contact Form: ${name}!`
      }
    }
  }
}

module.exports.send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body);
    const hCaptchaClientResponseToken = JSON.parse(event.body).hCaptcha;

    if (hCaptchaClientResponseToken !== undefined && hCaptchaClientResponseToken !== '') {
      return new Promise((resolve, reject) => {
        request.post({
          url: 'https://hcaptcha.com/siteverify', formData: {
            secret: hcaptcha_secret,
            response: hCaptchaClientResponseToken
          }
        }, async (err, httpResponse, body) => {
          if (err) {
            console.log(err);
            reject(generateError(403, {message: 'Could not verify hCaptcha'}));
          } else {
            console.log(body);
            const data = await ses.sendEmail(emailParams).promise();
            resolve(generateResponse(200, data));
          }
        });
      });
    }
    else return generateError(403, {message: 'Captcha token missing'});

  } catch (err) {
    return generateError(500, err)
  }
};