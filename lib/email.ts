export async function sendApprovalEmail(email: string, name: string) {
  try {
    // TODO: Integrate with your email service
    console.log(`Sending approval email to ${email}`)
    
    // Example with fetch to your email API endpoint
    /*
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Your Verification Has Been Approved! 🎉',
        html: `
          <h1>Congratulations, ${name}!</h1>
          <p>Your entrepreneur verification has been approved.</p>
          <p>You can now access your dashboard and start connecting with investors.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a>
        `
      })
    })
    */
    
    return { success: true }
  } catch (error) {
    console.error('Error sending approval email:', error)
    return { success: false, error }
  }
}

export async function sendRejectionEmail(email: string, name: string, reason: string) {
  try {
    console.log(`Sending rejection email to ${email}`)
    
    // TODO: Integrate with your email service
    /*
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Update on Your Verification Request',
        html: `
          <h1>Hello ${name},</h1>
          <p>We've reviewed your verification request and unfortunately, we cannot approve it at this time.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>Please review the feedback and resubmit your application with the necessary corrections.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/entrepreneur-registration">Resubmit Application</a>
        `
      })
    })
    */
    
    return { success: true }
  } catch (error) {
    console.error('Error sending rejection email:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotification(requestId: string, entrepreneurName: string) {
  try {
    console.log(`Sending admin notification for request ${requestId}`)
    
    // TODO: Send notification to admin
    /*
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        subject: 'New Verification Request',
        html: `
          <h1>New Verification Request</h1>
          <p>Entrepreneur: ${entrepreneurName}</p>
          <p>Request ID: ${requestId}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/verification-requests">Review Request</a>
        `
      })
    })
    */
    
    return { success: true }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}