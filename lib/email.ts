import nodemailer from 'nodemailer'

interface EmailResponse {
  success: boolean
  message?: string
  error?: string
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/**
 * Send rejection email to user
 */
export async function sendRejectionEmail(
  userEmail: string,
  userName: string,
  rejectionReason: string
): Promise<EmailResponse> {
  try {
    const mailOptions = {
      from: `"Verification System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Verification Request - Rejected',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Verification Request Rejected</h2>
          <p>Hello ${userName},</p>
          <p>We regret to inform you that your verification request has been rejected.</p>
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
            <strong>Reason:</strong> ${rejectionReason}
          </div>
          <p>If you have any questions or would like to reapply, please contact us.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br/>
            Arijit Sarkar<br/>
            <a href="mailto:arijit.sarkar7156@gmail.com">arijit.sarkar7156@gmail.com</a>
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Rejection email sent successfully to:', userEmail)
    
    return {
      success: true,
      message: 'Rejection email sent successfully'
    }

  } catch (error: any) {
    console.error('Failed to send rejection email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send rejection email'
    }
  }
}

/**
 * Send approval email to user
 */
export async function sendApprovalEmail(
  userEmail: string,
  userName: string
): Promise<EmailResponse> {
  try {
    const mailOptions = {
      from: `"Verification System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Verification Request - Approved ✓',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Verification Request Approved!</h2>
          <p>Congratulations ${userName}!</p>
          <p>Your verification request has been <strong>approved</strong>.</p>
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;">You can now access all features of our platform. Thank you for your patience.</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br/>
            Arijit Sarkar<br/>
            <a href="mailto:arijit.sarkar7156@gmail.com">arijit.sarkar7156@gmail.com</a>
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Approval email sent successfully to:', userEmail)
    
    return {
      success: true,
      message: 'Approval email sent successfully'
    }

  } catch (error: any) {
    console.error('Failed to send approval email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send approval email'
    }
  }
}

/**
 * Send notification to admin about new verification request
 */
export async function sendAdminNotification(
  requestId: string,
  userName: string
): Promise<EmailResponse> {
  try {
    const mailOptions = {
      from: `"Verification System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🔔 New Verification Request Submitted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Verification Request</h2>
          <p>A new verification request has been submitted.</p>
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p><strong>Submitted by:</strong> ${userName}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
          </div>
          <p>Please review and take action in the admin dashboard.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Admin notification sent successfully')
    
    return {
      success: true,
      message: 'Admin notification sent successfully'
    }

  } catch (error: any) {
    console.error('Failed to send admin notification:', error)
    return {
      success: false,
      error: error.message || 'Failed to send admin notification'
    }
  }
}

/**
 * Generic email sending function
 */
export async function sendEmail(
  to: string,
  subject: string,
  message: string
): Promise<EmailResponse> {
  try {
    const mailOptions = {
      from: `"Verification System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="white-space: pre-wrap;">${message}</div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br/>
            Arijit Sarkar
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to:', to)
    
    return {
      success: true,
      message: 'Email sent successfully'
    }

  } catch (error: any) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}