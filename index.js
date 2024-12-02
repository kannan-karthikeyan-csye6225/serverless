import sgMail from '@sendgrid/mail';
import AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager();

const getSecret = async () => {
  const secretArn = process.env.SENDGRID_SECRET_ARN;
  if (!secretArn) {
    throw new Error('Environment variable SENDGRID_SECRET_ARN is not set');
  }

  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretArn }).promise();

    return data.SecretString;
  } catch (error) {
    console.error(`Failed to retrieve secret with ARN "${secretArn}":`, error);
    throw new Error('Could not fetch the secret from Secrets Manager');
  }
};

export const handler = async (event) => {
  try {
    const sendGridApiKey = await getSecret();
    sgMail.setApiKey(sendGridApiKey);

    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, firstName, verificationUrl } = message;

    const msg = {
      to: email,
      from: 'noreply@demo.leodas.me',
      subject: 'Verify Your Email Address',
      html: `
        <h2>Welcome ${firstName}!</h2>
        <p>Please click the link below to verify your email address. This link will expire in 2 minutes.</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    };

    await sgMail.send(msg);

    console.log('Verification email sent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send verification email' }),
    };
  }
};
