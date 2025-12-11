// Email Integration using Nodemailer with Gmail
import nodemailer from 'nodemailer';

// All registration emails will be sent to this address
const ADMIN_EMAIL = 'keralaecomicforumhelp@gmail.com';

// Email credentials
const EMAIL_USER = 'keralaecomicforumhelp@gmail.com';
const EMAIL_PASS = 'kqtw pxxx ramo gbvm';

// Create nodemailer transporter
function createTransporter() {
  console.log('=== EMAIL CONFIG CHECK ===');
  console.log('EMAIL_USER configured: Yes');
  console.log('Creating Gmail transporter...');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

// Send email using nodemailer
async function sendEmail(to: string, subject: string, htmlBody: string) {
  console.log('=== SENDING EMAIL ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  
  const transporter = createTransporter();

  try {
    console.log('Attempting to send email via Gmail...');
    const result = await transporter.sendMail({
      from: `Kerala Economic Forum <${EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlBody
    });

    console.log('=== EMAIL SENT SUCCESSFULLY ===');
    console.log('Message ID:', result.messageId);
    return { success: true, result };
  } catch (error: any) {
    console.error('=== EMAIL SEND FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
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
    const adminEmailHtml = `
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

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">Registration Confirmed!</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Dear ${registration.fullName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            Thank you for registering for the <strong>Startup Boot Camp</strong> organized by Kerala Economic Forum!
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            We have received your registration successfully. Our team will review your application and get back to you shortly with further details.
          </p>
          
          <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 10px 0;">Your Registration Details:</h3>
            <p style="color: #374151; margin: 5px 0;"><strong>Name:</strong> ${registration.fullName}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Email:</strong> ${registration.email}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Phone:</strong> ${registration.phone}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Registered on:</strong> ${new Date(registration.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            If you have any questions, feel free to reach out to us at <a href="mailto:keralaecomicforumhelp@gmail.com" style="color: #dc2626;">keralaecomicforumhelp@gmail.com</a>
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            Best regards,<br/>
            <strong>Kerala Economic Forum Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Empowering Entrepreneurs
          </p>
        </div>
      </div>
    `;

    const adminResult = await sendEmail(
      ADMIN_EMAIL,
      `New Bootcamp Registration: ${registration.fullName}`,
      adminEmailHtml
    );

    const userResult = await sendEmail(
      registration.email,
      `Registration Confirmed - Startup Boot Camp | Kerala Economic Forum`,
      userEmailHtml
    );

    return { adminResult, userResult };
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
    const adminEmailHtml = `
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

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">Application Received!</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Dear ${application.fullName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            Thank you for applying for membership at <strong>Kerala Economic Forum</strong>!
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            We have received your application for <strong>${application.membershipType}</strong> membership. Our team will review your application and contact you shortly.
          </p>
          
          <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin: 0 0 10px 0;">Your Application Details:</h3>
            <p style="color: #374151; margin: 5px 0;"><strong>Name:</strong> ${application.fullName}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Email:</strong> ${application.email}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Membership Type:</strong> ${application.membershipType}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Applied on:</strong> ${new Date(application.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            If you have any questions, feel free to reach out to us at <a href="mailto:keralaecomicforumhelp@gmail.com" style="color: #dc2626;">keralaecomicforumhelp@gmail.com</a>
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            Best regards,<br/>
            <strong>Kerala Economic Forum Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Empowering Entrepreneurs
          </p>
        </div>
      </div>
    `;

    const adminResult = await sendEmail(
      ADMIN_EMAIL,
      `New Membership Application: ${application.fullName}`,
      adminEmailHtml
    );

    const userResult = await sendEmail(
      application.email,
      `Application Received - Kerala Economic Forum Membership`,
      userEmailHtml
    );

    return { adminResult, userResult };
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
    const adminEmailHtml = `
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

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">Message Received!</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Dear ${contact.name},</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            Thank you for reaching out to <strong>Kerala Economic Forum</strong>!
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            We have received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #d97706; margin: 0 0 10px 0;">Your Message:</h3>
            <p style="color: #374151; margin: 5px 0;"><strong>Subject:</strong> ${contact.subject}</p>
            <p style="color: #374151; margin: 5px 0; white-space: pre-wrap;"><strong>Message:</strong> ${contact.message}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Sent on:</strong> ${new Date(contact.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            Best regards,<br/>
            <strong>Kerala Economic Forum Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Empowering Entrepreneurs
          </p>
        </div>
      </div>
    `;

    const adminResult = await sendEmail(
      ADMIN_EMAIL,
      `Contact Form: ${contact.subject}`,
      adminEmailHtml
    );

    const userResult = await sendEmail(
      contact.email,
      `Message Received - Kerala Economic Forum`,
      userEmailHtml
    );

    return { adminResult, userResult };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return { success: false, error };
  }
}
