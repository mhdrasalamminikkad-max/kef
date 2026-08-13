// Email Integration using Resend (HTTP API - works on Render)
import { Resend } from 'resend';
import QRCode from 'qrcode';

// All registration emails will be sent to this address
const ADMIN_EMAIL = 'keralaecomicforumhelp@gmail.com';

// Resend API key strictly from environment variable
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY || '';
  return new Resend(apiKey);
}

// Primary and fallback sender domains based on Resend verified DNS records
const PRIMARY_FROM_EMAIL = 'Kerala Economic Forum <info@keralaeconomicforum.com>';
const SUBDOMAIN_FROM_EMAIL = 'Kerala Economic Forum <info@send.keralaeconomicforum.com>';
const FALLBACK_FROM_EMAIL = 'Kerala Economic Forum <onboarding@resend.dev>';

// Send email using Resend API with domain fallback
async function sendEmail(to: string, subject: string, htmlBody: string, attachments?: Array<{filename: string; content: Buffer; cid?: string}>) {
  console.log('=== SENDING EMAIL VIA RESEND ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  
  const resend = getResendClient();
  
  const resendAttachments = attachments?.map(att => ({
    filename: att.filename,
    content: att.content
  }));

  const fromAddresses = [
    'Kerala Economic Forum <info@send.keralaeconomicforum.com>',
    'info@send.keralaeconomicforum.com',
    'Kerala Economic Forum <info@keralaeconomicforum.com>',
    'info@keralaeconomicforum.com',
    'Kerala Economic Forum <onboarding@resend.dev>',
    'onboarding@resend.dev'
  ];

  for (const fromAddress of fromAddresses) {
    try {
      console.log('[RESEND] Attempting send from:', fromAddress);
      const result = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: subject,
        html: htmlBody,
        attachments: resendAttachments
      });

      if (result.error) {
        console.warn(`[RESEND WARNING] Failed sending from ${fromAddress}:`, result.error);
        continue;
      }

      console.log('=== EMAIL SENT SUCCESSFULLY ===');
      console.log('Result:', result);
      return { success: true, result };
    } catch (error: any) {
      console.warn(`[RESEND ATTEMPT FAILED] From ${fromAddress}:`, error?.message || error);
    }
  }

  console.error('=== ALL RESEND SENDER DOMAIN ATTEMPTS FAILED ===');
  return { success: false, error: "Failed to send email across all configured sender domains" };
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
// QR code contains a URL to the verification page
async function generateMembershipQRCodeBuffer(memberData: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: string;
}): Promise<Buffer> {
  // Use the production URL for the verification page
  const verificationUrl = `https://keralaeconomicforum.com/verify/${memberData.id}`;
  
  const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
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
    // Generate QR code as buffer for attachment
    const qrCodeBuffer = await generateMembershipQRCodeBuffer({
      id: membership.id,
      fullName: membership.fullName,
      email: membership.email,
      phone: membership.phone,
      membershipType: membership.membershipType
    });
    
    // Convert QR code to base64 for inline display in email
    const qrCodeBase64 = qrCodeBuffer.toString('base64');
    
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
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0;">
                  <p style="margin: 0; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Member ID</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${membership.id.substring(0, 8).toUpperCase()}</p>
                </td>
                <td style="padding: 0; text-align: right;">
                  <p style="margin: 0; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Membership Type</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #fbbf24;">${membershipDetails.name}</p>
                </td>
              </tr>
            </table>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
              <p style="margin: 0; font-size: 20px; font-weight: bold;">${membership.fullName}</p>
              ${membership.organization ? `<p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${membership.organization}</p>` : ''}
              ${membership.designation ? `<p style="margin: 3px 0 0 0; font-size: 13px; opacity: 0.7;">${membership.designation}</p>` : ''}
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 0; font-size: 12px; opacity: 0.8;">
                  <p style="margin: 0;">Valid From</p>
                  <p style="margin: 3px 0 0 0; font-weight: bold; opacity: 1;">${membershipValidFrom}</p>
                </td>
                <td style="padding: 0; text-align: right; font-size: 12px; opacity: 0.8;">
                  <p style="margin: 0;">Valid Until</p>
                  <p style="margin: 3px 0 0 0; font-weight: bold; opacity: 1;">${membershipValidUntil}</p>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- QR Code Section -->
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 10px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Your Membership QR Code</h3>
            <img src="data:image/png;base64,${qrCodeBase64}" alt="Membership QR Code" style="width: 180px; height: 180px; border: 4px solid white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
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
            <a href="https://keralaeconomicforum.com" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; margin-top: 15px;">
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

    // QR code attachment for download
    const qrAttachment = {
      filename: 'membership-qr.png',
      content: qrCodeBuffer
    };

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

// Send program registration email to admin
export async function sendProgramRegistrationEmail(registration: {
  programId: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode?: string;
  age?: string | null;
  company?: string | null;
  designation?: string | null;
  isMember: boolean;
  membershipNumber?: string | null;
  attendeeType: string;
  affiliation: string;
  expectations?: string | null;
  createdAt: Date;
  programName?: string;
}) {
  try {
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">New Program Registration</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Attendee Details</h2>
          
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
              <td style="padding: 10px; color: #1f2937;">${registration.countryCode || '+91'} ${registration.phone}</td>
            </tr>
            ${registration.age ? `
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Age:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.age}</td>
            </tr>
            ` : ''}
            ${registration.company ? `
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Company:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.company}</td>
            </tr>
            ` : ''}
            ${registration.designation ? `
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Designation:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.designation}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">Attendee Type:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.attendeeType === 'first-time' ? 'First-time Attendee' : 'Returning Attendee'}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Affiliation:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.affiliation.charAt(0).toUpperCase() + registration.affiliation.slice(1)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151;">KEF Member:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.isMember ? 'Yes' : 'No'}${registration.membershipNumber ? ` (${registration.membershipNumber})` : ''}</td>
            </tr>
            ${registration.expectations ? `
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Expectations:</td>
              <td style="padding: 10px; color: #1f2937;">${registration.expectations}</td>
            </tr>
            ` : ''}
            <tr style="background: #fef3c7;">
              <td style="padding: 10px; font-weight: bold; color: #374151;">Registered At:</td>
              <td style="padding: 10px; color: #1f2937;">${new Date(registration.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Kerala Economic Forum - Program Registration
          </p>
        </div>
      </div>
    `;

    const userEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 0; background-color: #f8fafc; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #dc2626 100%); padding: 40px 30px; text-align: center; color: white;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.3);">
            Registration Received
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Kerala Economic Forum</h1>
          <p style="margin: 0; font-size: 16px; color: #f1f5f9; opacity: 0.9;">${registration.programName || 'Program Registration'}</p>
        </div>

        <div style="padding: 32px 28px; background: white;">
          
          <!-- Status Banner -->
          <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 12px; padding: 16px 20px; text-align: center; margin-bottom: 28px;">
            <p style="margin: 0; color: #854d0e; font-size: 16px; font-weight: 700;">
              ⏳ Registration Under Review
            </p>
            <p style="margin: 4px 0 0 0; color: #a16207; font-size: 13px;">
              Thank you! Your payment details and registration are currently being verified by our team.
            </p>
          </div>

          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0;">
            Dear <strong>${registration.fullName}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Thank you for registering for <strong>${registration.programName || 'our upcoming program'}</strong> organized by the Kerala Economic Forum! Below are your submitted registration details:
          </p>

          <!-- DETAILS CARD -->
          <div style="margin: 28px 0; background: #f8fafc; border-radius: 16px; padding: 24px; color: #1e293b; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #dc2626; font-weight: bold; letter-spacing: 1px;">Selected Event</p>
              <h3 style="margin: 4px 0 0 0; font-size: 18px; color: #0f172a;">${registration.programName || 'KEF Program'}</h3>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 35%;">Participant Name:</td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${registration.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email Address:</td>
                <td style="padding: 8px 0; color: #334155; font-size: 14px;">${registration.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Phone Number:</td>
                <td style="padding: 8px 0; color: #334155; font-size: 14px;">${registration.countryCode || '+91'} ${registration.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Submitted On:</td>
                <td style="padding: 8px 0; color: #334155; font-size: 14px;">${new Date(registration.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
              <strong>ℹ️ What Happens Next?</strong><br/>
              Our team will verify your payment details. Upon successful verification, you will receive a follow-up email containing your <strong>Official VIP Entry Ticket with QR Code Pass</strong> for entry to the venue.
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 20px; text-align: center;">
            <p style="color: #475569; font-size: 14px; margin: 0;">Need Help? Contact us at:</p>
            <p style="margin: 6px 0 0 0;"><a href="mailto:keralaecomicforumhelp@gmail.com" style="color: #dc2626; font-weight: bold; text-decoration: none;">keralaecomicforumhelp@gmail.com</a></p>
          </div>
        </div>

        <div style="background: #0f172a; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          © ${new Date().getFullYear()} Kerala Economic Forum. All rights reserved.
        </div>
      </div>
    `;

    const adminResult = await sendEmail(
      ADMIN_EMAIL,
      `New Program Registration: ${registration.fullName} - ${registration.programName || 'KEF Event'}`,
      adminEmailHtml
    );

    const userResult = await sendEmail(
      registration.email,
      `Registration Confirmed: ${registration.programName || 'Kerala Economic Forum Program'}`,
      userEmailHtml
    );

    console.log('Program registration email sent to admin:', ADMIN_EMAIL);
    console.log('Program registration confirmation sent to:', registration.email);
    return { adminResult, userResult };
  } catch (error) {
    console.error('Failed to send program registration email:', error);
    return { success: false, error };
  }
}

// Send Program Registration Approval Email with Invitation Card and QR Code
export async function sendProgramRegistrationApprovalEmail(registration: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programTitle?: string;
  eventDate?: string | null;
  venue?: string | null;
}) {
  try {
    const verificationUrl = `https://keralaeconomicforum.com/verify?id=${registration.id}`;
    const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
    const qrCodeBase64 = qrCodeBuffer.toString('base64');
    const ticketId = registration.id.substring(0, 8).toUpperCase();

    const userEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 0; background-color: #f8fafc; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #dc2626 100%); padding: 40px 30px; text-align: center; color: white;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.3);">
            Official Registration Pass
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Kerala Economic Forum</h1>
          <p style="margin: 0; font-size: 16px; color: #f1f5f9; opacity: 0.9;">Your Ticket & Official Invitation Card</p>
        </div>

        <div style="padding: 32px 28px; background: white;">
          
          <!-- Status Banner -->
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; text-align: center; margin-bottom: 28px;">
            <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 700;">
              ✓ Registration Approved!
            </p>
            <p style="margin: 4px 0 0 0; color: #15803d; font-size: 13px;">
              Your payment has been manually verified by our team. Welcome aboard!
            </p>
          </div>

          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0;">
            Dear <strong>${registration.fullName}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            We are delighted to invite you to <strong>${registration.programTitle || 'our upcoming program'}</strong> organized by the Kerala Economic Forum. Below is your official entry pass and verification ticket.
          </p>

          <!-- INVITATION CARD / TICKET -->
          <div style="margin: 28px 0; background: linear-gradient(145deg, #1e293b, #0f172a); border-radius: 16px; padding: 24px; color: white; border: 2px solid #fbbf24; position: relative; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 16px; margin-bottom: 16px;">
              <div>
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #fbbf24; font-weight: bold; letter-spacing: 1px;">Program Pass</p>
                <h3 style="margin: 4px 0 0 0; font-size: 18px; color: white;">${registration.programTitle || 'KEF Program'}</h3>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8;">Ticket ID</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; font-family: monospace; font-weight: bold; color: #38bdf8;">#${ticketId}</p>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 12px; width: 35%;">Attendee Name:</td>
                <td style="padding: 6px 0; color: white; font-size: 14px; font-weight: bold;">${registration.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 12px;">Email:</td>
                <td style="padding: 6px 0; color: #e2e8f0; font-size: 13px;">${registration.email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 12px;">Phone:</td>
                <td style="padding: 6px 0; color: #e2e8f0; font-size: 13px;">${registration.phone}</td>
              </tr>
              ${registration.eventDate ? `
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 12px;">Event Date:</td>
                <td style="padding: 6px 0; color: #fbbf24; font-size: 13px; font-weight: bold;">${registration.eventDate}</td>
              </tr>
              ` : ''}
              ${registration.venue ? `
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 12px;">Venue:</td>
                <td style="padding: 6px 0; color: #e2e8f0; font-size: 13px;">${registration.venue}</td>
              </tr>
              ` : ''}
            </table>

            <!-- QR Code on Ticket -->
            <div style="background: white; border-radius: 12px; padding: 16px; text-align: center; margin-top: 10px;">
              <img src="data:image/png;base64,${qrCodeBase64}" alt="Entry Pass QR Code" style="width: 160px; height: 160px; display: block; margin: 0 auto;" />
              <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 12px; font-weight: 600;">
                Scan QR Code for Gate Entry Verification
              </p>
            </div>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; text-align: center;">
            Please present this invitation email or QR pass at the event registration counter.
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 20px; text-align: center;">
            <p style="color: #475569; font-size: 14px; margin: 0;">Warm Regards,</p>
            <p style="color: #0f172a; font-size: 15px; font-weight: bold; margin: 4px 0 0 0;">Kerala Economic Forum Team</p>
            <p style="color: #dc2626; font-size: 13px; margin: 4px 0 0 0;">info@keralaeconomicforum.com</p>
          </div>
        </div>

        <div style="background: #0f172a; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          © ${new Date().getFullYear()} Kerala Economic Forum. All rights reserved.
        </div>
      </div>
    `;

    const qrAttachment = {
      filename: `KEF-Pass-${ticketId}.png`,
      content: qrCodeBuffer
    };

    const userResult = await sendEmail(
      registration.email,
      `🎉 Registration Approved & Official Pass - ${registration.programTitle || 'Kerala Economic Forum'}`,
      userEmailHtml,
      [qrAttachment]
    );

    return { success: true, userResult };
  } catch (error) {
    console.error('Failed to send program approval email:', error);
    return { success: false, error };
  }
}

// Send Program Registration Rejection Email
export async function sendProgramRegistrationRejectionEmail(registration: {
  fullName: string;
  email: string;
  programTitle?: string;
}) {
  try {
    const userEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Kerala Economic Forum</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Registration Status Update</p>
        </div>

        <div style="padding: 28px; background: white;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Dear ${registration.fullName},</h2>
          
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Thank you for your interest in registering for <strong>${registration.programTitle || 'our program'}</strong>.
          </p>

          <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b; font-size: 15px; font-weight: 700;">
              ❌ Registration Status: Rejected
            </p>
            <p style="margin: 8px 0 0 0; color: #7f1d1d; font-size: 13.5px; line-height: 1.5;">
              During our manual verification process, your submitted payment details or payment proof screenshot could not be verified or did not comply with our registration guidelines. As per our malpractice policy, your registration has been rejected.
            </p>
          </div>

          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            If you believe this is an error or if you wish to re-submit valid payment details, please contact our support team at <a href="mailto:keralaecomicforumhelp@gmail.com" style="color: #dc2626; text-decoration: underline;">keralaecomicforumhelp@gmail.com</a>.
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 18px;">
            <p style="color: #475569; font-size: 13.5px; margin: 0;">Regards,</p>
            <p style="color: #0f172a; font-size: 14.5px; font-weight: bold; margin: 4px 0 0 0;">Kerala Economic Forum Team</p>
          </div>
        </div>

        <div style="background: #1e293b; padding: 14px; text-align: center; color: #94a3b8; font-size: 12px;">
          Kerala Economic Forum Help Desk
        </div>
      </div>
    `;

    const userResult = await sendEmail(
      registration.email,
      `Registration Status Update - ${registration.programTitle || 'Kerala Economic Forum'}`,
      userEmailHtml
    );

    return { success: true, userResult };
  } catch (error) {
    console.error('Failed to send program rejection email:', error);
    return { success: false, error };
  }
}

