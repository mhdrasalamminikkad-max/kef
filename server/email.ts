// Email Integration - Supports both Resend (Railway) and Gmail (Nodemailer)
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// All registration emails will be sent to this address
const ADMIN_EMAIL = 'keralaeconomicforum@gmail.com';

// Check which email service is available
function getEmailService(): 'resend' | 'gmail' | null {
  if (process.env.RESEND_API_KEY) {
    console.log('Using Resend for email delivery');
    return 'resend';
  }
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Using Gmail/Nodemailer for email delivery');
    return 'gmail';
  }
  console.warn('No email service configured. Set RESEND_API_KEY or EMAIL_USER/EMAIL_PASS');
  return null;
}

// Create Resend client
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// Create nodemailer transporter using environment variables
function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
}

// Send email using available service (Resend or Gmail)
async function sendEmail(to: string, subject: string, htmlBody: string) {
  const service = getEmailService();
  
  if (!service) {
    console.log('Email service not available. Skipping email send.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    if (service === 'resend') {
      const resend = getResendClient();
      if (!resend) {
        return { success: false, error: 'Resend client not available' };
      }
      
      const result = await resend.emails.send({
        from: 'Kerala Economic Forum <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: htmlBody
      });
      
      console.log('Email sent via Resend:', result);
      return { success: true, result };
    } else {
      // Gmail/Nodemailer
      const transporter = createTransporter();
      if (!transporter) {
        return { success: false, error: 'Gmail transporter not available' };
      }
      
      const emailUser = process.env.EMAIL_USER;
      const result = await transporter.sendMail({
        from: `Kerala Economic Forum <${emailUser}>`,
        to: to,
        subject: subject,
        html: htmlBody
      });

      console.log('Email sent via Gmail:', result.messageId);
      return { success: true, result };
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
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
  photo?: string | null;
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
            ${registration.photo ? `
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Photo:</td>
              <td style="padding: 10px; color: #1f2937;">Uploaded</td>
            </tr>
            ` : ''}
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Payment Proof:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.paymentProof ? 'Uploaded' : 'Not uploaded'}</td>
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
