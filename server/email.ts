// Email Integration - Gmail for Replit, Resend for Railway
import { google } from 'googleapis';
import { Resend } from 'resend';

// All registration emails will be sent to this address
const ADMIN_EMAIL = 'keralaeconomicforum@gmail.com';

// Resend client for Railway deployment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let connectionSettings: any;

// Check if we're in Replit environment
function isReplitEnvironment(): boolean {
  return !!(process.env.REPLIT_CONNECTORS_HOSTNAME && (process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL));
}

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function createEmail(to: string, subject: string, htmlBody: string): string {
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    htmlBody
  ];
  
  const email = emailLines.join('\r\n');
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Send email via Gmail (Replit)
async function sendViaGmail(to: string, subject: string, htmlBody: string) {
  const gmail = await getGmailClient();
  const rawEmail = createEmail(to, subject, htmlBody);
  
  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawEmail
    }
  });
  
  console.log('Email sent successfully via Gmail:', result.data);
  return { success: true, result: result.data };
}

// Send email via Resend (Railway)
async function sendViaResend(to: string, subject: string, htmlBody: string) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }
  
  const result = await resend.emails.send({
    from: 'Kerala Economic Forum <noreply@keralaeconomicforum.com>',
    to: to,
    subject: subject,
    html: htmlBody
  });
  
  console.log('Email sent successfully via Resend:', result);
  return { success: true, result };
}

// Universal email sender - tries Gmail first, then Resend
async function sendEmail(to: string, subject: string, htmlBody: string) {
  // Try Gmail first if in Replit environment
  if (isReplitEnvironment()) {
    try {
      return await sendViaGmail(to, subject, htmlBody);
    } catch (gmailError) {
      console.log('Gmail failed, trying Resend...', gmailError);
    }
  }
  
  // Try Resend (for Railway or if Gmail fails)
  if (resend) {
    try {
      return await sendViaResend(to, subject, htmlBody);
    } catch (resendError) {
      console.error('Resend also failed:', resendError);
      throw resendError;
    }
  }
  
  throw new Error('No email provider available');
}

export async function sendBootcampRegistrationEmail(registration: {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  organization: string;
  paymentProof: string;
  district: string;
  experience: string;
  expectations?: string | null;
  createdAt: Date;
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">New Bootcamp Registration</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Participant Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151; width: 40%;">Full Name:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.fullName}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Phone:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.phone}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Age:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.age}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Organization/Institution:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.organization}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">District:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.district}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Experience:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.experience}</td>
            </tr>
            ${registration.expectations ? `
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Expectations:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.expectations}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Payment Proof:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.paymentProof}</td>
            </tr>
            <tr style="background: #fef3c7;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Registered At:</td>
              <td style="padding: 10px; color: #1f2937;">${new Date(registration.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Startup Boot Camp Registration
          </p>
        </div>
      </div>
    `;

    return await sendEmail(
      ADMIN_EMAIL,
      `New Bootcamp Registration: ${registration.fullName}`,
      emailHtml
    );
  } catch (error) {
    console.error('Failed to send bootcamp registration email:', error);
    return { success: false, error };
  }
}

export async function sendMembershipApplicationEmail(application: {
  fullName: string;
  email: string;
  phone: string;
  organization?: string | null;
  designation?: string | null;
  membershipType: string;
  interests: string;
  createdAt: Date;
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">New Membership Application</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Applicant Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151; width: 40%;">Full Name:</td>
              <td style="padding: 10px; color: #1f2937;">${application.fullName}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 10px; color: #1f2937;">${application.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Phone:</td>
              <td style="padding: 10px; color: #1f2937;">${application.phone}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Membership Type:</td>
              <td style="padding: 10px; color: #1f2937;">${application.membershipType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Interests:</td>
              <td style="padding: 10px; color: #1f2937;">${application.interests}</td>
            </tr>
            ${application.organization ? `
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Organization:</td>
              <td style="padding: 10px; color: #1f2937;">${application.organization}</td>
            </tr>
            ` : ''}
            ${application.designation ? `
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Designation:</td>
              <td style="padding: 10px; color: #1f2937;">${application.designation}</td>
            </tr>
            ` : ''}
            <tr style="background: #fef3c7;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Applied At:</td>
              <td style="padding: 10px; color: #1f2937;">${new Date(application.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Membership Application
          </p>
        </div>
      </div>
    `;

    return await sendEmail(
      ADMIN_EMAIL,
      `New Membership Application: ${application.fullName}`,
      emailHtml
    );
  } catch (error) {
    console.error('Failed to send membership application email:', error);
    return { success: false, error };
  }
}

export async function sendContactFormEmail(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">New Contact Message</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151; width: 30%;">Name:</td>
              <td style="padding: 10px; color: #1f2937;">${contact.name}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 10px; color: #1f2937;">${contact.email}</td>
            </tr>
            ${contact.phone ? `
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Phone:</td>
              <td style="padding: 10px; color: #1f2937;">${contact.phone}</td>
            </tr>
            ` : ''}
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Subject:</td>
              <td style="padding: 10px; color: #1f2937;">${contact.subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #374151; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
            <p style="color: #1f2937; margin: 0; white-space: pre-wrap;">${contact.message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">
            Received at: ${new Date(contact.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Contact Form Submission
          </p>
        </div>
      </div>
    `;

    return await sendEmail(
      ADMIN_EMAIL,
      `Contact Form: ${contact.subject}`,
      emailHtml
    );
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return { success: false, error };
  }
}
