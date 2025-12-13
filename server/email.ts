// Email Integration using Nodemailer with Gmail
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

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
async function sendEmail(to: string, subject: string, htmlBody: string, attachments?: Array<{filename: string; content: Buffer; cid: string}>) {
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
      html: htmlBody,
      attachments: attachments
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

// Generate QR code as Buffer for email attachment
async function generateMembershipQRCodeBuffer(memberData: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: string;
}): Promise<Buffer> {
  const qrData = JSON.stringify({
    memberId: memberData.id,
    name: memberData.fullName,
    email: memberData.email,
    phone: memberData.phone,
    type: memberData.membershipType,
    org: 'Kerala Economic Forum',
    verified: true
  });
  
  const qrCodeBuffer = await QRCode.toBuffer(qrData, {
    width: 200,
    margin: 2,
    color: {
      dark: '#1f2937',
      light: '#ffffff'
    }
  });
  
  return qrCodeBuffer;
}

// Get membership type details
function getMembershipTypeDetails(type: string): { name: string; benefits: string[]; validity: string } {
  const types: Record<string, { name: string; benefits: string[]; validity: string }> = {
    individual: {
      name: 'Individual Membership',
      benefits: [
        'Access to all KEF events and workshops',
        'Networking opportunities with entrepreneurs',
        'Monthly newsletter and updates',
        'Discounts on event registrations',
        'Access to online resources and materials'
      ],
      validity: '1 Year'
    },
    student: {
      name: 'Student Membership',
      benefits: [
        'Access to student-focused programs',
        'Mentorship opportunities',
        'Career guidance sessions',
        'Internship connections',
        'Free access to workshops'
      ],
      validity: '1 Year'
    },
    corporate: {
      name: 'Corporate Membership',
      benefits: [
        'Priority access to all KEF events',
        'Company branding at KEF events',
        'Multiple employee registrations',
        'Exclusive B2B networking sessions',
        'Partnership opportunities',
        'Dedicated relationship manager'
      ],
      validity: '1 Year'
    },
    institutional: {
      name: 'Institutional Membership',
      benefits: [
        'Collaboration on research projects',
        'Joint event organization',
        'Student exchange programs',
        'Faculty development programs',
        'Industry-academia partnerships',
        'Access to KEF resource network'
      ],
      validity: '1 Year'
    }
  };
  
  return types[type] || types['individual'];
}

// Send membership invitation email with QR code
export async function sendMembershipInvitationEmail(membership: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string | null;
  designation?: string | null;
  membershipType: string;
  interests: string;
  createdAt: Date;
  paymentAmount?: string | null;
}) {
  try {
    // Generate QR code as buffer for inline attachment
    const qrCodeBuffer = await generateMembershipQRCodeBuffer({
      id: membership.id,
      fullName: membership.fullName,
      email: membership.email,
      phone: membership.phone,
      membershipType: membership.membershipType
    });
    
    // QR code attachment for email
    const qrAttachment = {
      filename: 'membership-qr.png',
      content: qrCodeBuffer,
      cid: 'membership-qr'
    };
    
    const membershipDetails = getMembershipTypeDetails(membership.membershipType);
    const benefitsList = membershipDetails.benefits.map(b => 
      `<li style="color: #374151; margin: 8px 0; padding-left: 5px;">${b}</li>`
    ).join('');
    
    const membershipValidFrom = new Date(membership.createdAt).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    
    const validUntil = new Date(membership.createdAt);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const membershipValidUntil = validUntil.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Kerala Economic Forum!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Membership is Now Active</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Dear ${membership.fullName},</h2>
          
          <p style="color: #374151; line-height: 1.8; font-size: 15px; text-align: center;">
            Congratulations! Your membership with <strong>Kerala Economic Forum</strong> has been approved. 
            We are thrilled to have you as part of our growing community of entrepreneurs, innovators, and changemakers.
          </p>
          
          <!-- Membership Card -->
          <div style="background: linear-gradient(135deg, #1f2937, #374151); border-radius: 15px; padding: 25px; margin: 25px 0; color: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div>
                <p style="margin: 0; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Member ID</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${membership.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Membership Type</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #fbbf24;">${membershipDetails.name}</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
              <p style="margin: 0; font-size: 20px; font-weight: bold;">${membership.fullName}</p>
              ${membership.organization ? `<p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${membership.organization}</p>` : ''}
              ${membership.designation ? `<p style="margin: 3px 0 0 0; font-size: 13px; opacity: 0.7;">${membership.designation}</p>` : ''}
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 12px; opacity: 0.8;">
              <div>
                <p style="margin: 0;">Valid From</p>
                <p style="margin: 3px 0 0 0; font-weight: bold; opacity: 1;">${membershipValidFrom}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0;">Valid Until</p>
                <p style="margin: 3px 0 0 0; font-weight: bold; opacity: 1;">${membershipValidUntil}</p>
              </div>
            </div>
          </div>
          
          <!-- QR Code Section -->
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 10px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Your Membership QR Code</h3>
            <img src="cid:membership-qr" alt="Membership QR Code" style="width: 180px; height: 180px; border: 4px solid white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            <p style="color: #6b7280; font-size: 13px; margin: 15px 0 0 0;">
              Scan this QR code at any KEF event for instant verification
            </p>
          </div>
          
          <!-- Member Details -->
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #d97706; margin: 0 0 15px 0; text-align: center;">Your Member Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">Full Name:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.phone}</td>
              </tr>
              ${membership.organization ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Organization:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.organization}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Interests:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.interests}</td>
              </tr>
              ${membership.paymentAmount ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Payment Amount:</td>
                <td style="padding: 8px 0; color: #1f2937;">${membership.paymentAmount}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <!-- Membership Benefits -->
          <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 10px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #16a34a; margin: 0 0 15px 0; text-align: center;">Your Membership Benefits</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${benefitsList}
            </ul>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              Start exploring the benefits of your membership today!
            </p>
            <a href="https://keralastartupfest.com" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; margin-top: 15px;">
              Visit Our Website
            </a>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-top: 25px;">
            If you have any questions about your membership, feel free to reach out to us at 
            <a href="mailto:keralaecomicforumhelp@gmail.com" style="color: #dc2626;">keralaecomicforumhelp@gmail.com</a>
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin-top: 20px;">
            Welcome aboard!<br/>
            <strong>Kerala Economic Forum Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Empowering Entrepreneurs
          </p>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
            This email contains your membership invitation and QR code. Please keep it safe.
          </p>
        </div>
      </div>
    `;

    const userResult = await sendEmail(
      membership.email,
      `Welcome to Kerala Economic Forum - Your Membership is Active!`,
      userEmailHtml,
      [qrAttachment]
    );

    // Send a copy to KEF admin email
    const adminCopyResult = await sendEmail(
      'keralaeconomicforum@gmail.com',
      `Membership Approved: ${membership.fullName} - ${membershipDetails.name}`,
      userEmailHtml,
      [qrAttachment]
    );

    console.log('Membership invitation email sent to:', membership.email);
    console.log('Membership invitation copy sent to: keralaeconomicforum@gmail.com');
    return { success: true, userResult, adminCopyResult };
  } catch (error) {
    console.error('Failed to send membership invitation email:', error);
    return { success: false, error };
  }
}
