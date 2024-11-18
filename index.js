import sgMail from '@sendgrid/mail';

export const handler = async (event) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
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
      `
    };
    await sgMail.send(msg);
    
    console.log('Verification email sent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send verification email' })
    };
  }
};
