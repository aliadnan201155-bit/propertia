export const getSchedulingEmailTemplate = (appointment, date, time, notes) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Viewing Scheduled</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${time}
        </p>
        ${notes ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Notes:</strong> ${notes}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
            We will confirm your appointment shortly
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;


export const getEmailTemplate = (appointment, status) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: ${
            status === 'confirmed' ? '#dcfce7' : status === 'cancelled' ? '#fee2e2' : '#fef3c7'
          }; color: ${
            status === 'confirmed' ? '#166534' : status === 'cancelled' ? '#991b1b' : '#854d0e'
          };">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${status === 'confirmed' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Arrive 10 minutes before your scheduled time
            </li>
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Bring valid identification
            </li>
          ` : status === 'cancelled' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #991b1b;">i</span>
              You can schedule another viewing at any time
            </li>
          ` : `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
              We will confirm your appointment shortly
            </li>
          `}
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getNewsletterTemplate = (email) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Propertia!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Premier Real Estate Newsletter</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #2563eb;">${email}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Thank you for joining our community of property enthusiasts!
      </p>
    </div>

    <!-- Benefits Section -->
    <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">What You'll Get:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Latest Property Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Real Estate Market Trends
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Exclusive Property Deals
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Investment Opportunities
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Explore Properties
      </a>
    </div>

    <!-- Important Note -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        <strong style="color: #1e40af;">📝 Note:</strong> To ensure you don't miss our updates, please add
        <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
        to your contacts.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Propertia. All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #2563eb; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getWelcomeTemplate = (name) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Propertia!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Dream Home Awaits</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #2563eb;">${name}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Welcome to our community of property enthusiasts! Your account has been successfully created.
      </p>
    </div>

    <!-- Features Section -->
    <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Unlock These Features:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Browse Premium Property Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Schedule Property Viewings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Save Favorite Properties
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Direct Contact with Property Owners
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}/properties"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Start Exploring Properties
      </a>
    </div>

    <!-- Support Section -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Assistance?</h3>
      <p style="margin: 0; color: #4b5563;">
        Our support team is available 24/7:
        <br>
        📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
        <br>
        📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Propertia. All rights reserved.
    </p>
    <div style="margin-top: 10px;">
      <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
  </div>
</div>
`;

export const getPasswordResetTemplate = (resetUrl) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Account Security</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Security Notice Box -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Password Reset Request</h2>
        <p style="margin: 8px 0; color: #374151;">
          We received a request to reset your password for your Propertia account. For your security, this link will expire in 10 minutes.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
          Reset Password
        </a>
      </div>

      <!-- Security Tips -->
      <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Security Notice</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            If you didn't request this password reset, please ignore this email
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            Never share this email or your password with anyone
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          If you didn't request this reset or need assistance:
          <br>
          📧 <a href="mailto:security@propertia.com" style="color: #2563eb; text-decoration: none;">security@propertia.com</a>
          <br>
          📞 <a href="tel:+92021567567" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getFeedbackEmailTemplate = (formData) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Feedback Received</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Contact Form</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Feedback Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Contact Information</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Name:</strong> ${formData.name}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #2563eb; text-decoration: none;">${formData.email}</a>
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Phone:</strong> <a href="tel:${formData.phone}" style="color: #2563eb; text-decoration: none;">${formData.phone}</a>
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <!-- Message Content -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
        <p style="margin: 0; color: #374151; white-space: pre-wrap;">${formData.message}</p>
      </div>

      <!-- Action Items -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">1</span>
            Review the feedback and assess priority
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">2</span>
            Respond to the customer within 24 hours
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">3</span>
            Log the feedback in the CRM system
          </li>
        </ul>
      </div>

      <!-- Quick Action Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="mailto:${formData.email}"
           style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
          Reply to ${formData.name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getAdminAppointmentNotificationTemplate = (appointment, user) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🔔 New Appointment Request</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Action Required</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Location:</strong> ${appointment.propertyId.location}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        ${appointment.notes ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Notes:</strong> ${appointment.notes}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending Approval</span>
        </p>
      </div>

      <!-- Customer Information -->
      <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #075985; margin: 0 0 15px 0; font-size: 20px;">Customer Information</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Name:</strong> ${user.name}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Email:</strong> <a href="mailto:${user.email}" style="color: #0284c7; text-decoration: none;">${user.email}</a>
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <!-- Action Required -->
      <div style="margin-top: 30px;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 18px;">⚡ Action Required</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #dc2626;">1</span>
            Review appointment details and customer profile
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #dc2626;">2</span>
            Check property availability for the requested time
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #dc2626;">3</span>
            Approve or reject the appointment request
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #dc2626;">4</span>
            Customer will be notified of your decision
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>
      

     <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getAppointmentRescheduleTemplate = (appointment, oldDate, oldTime, newDate, newTime) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">📅 Appointment Rescheduled</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Alert Box -->
      <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <p style="margin: 0; color: #92400e; font-weight: 600;">
          ⚠️ Your appointment has been rescheduled to a new date and time
        </p>
      </div>

      <!-- Property Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Property Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Location:</strong> ${appointment.propertyId.location}
        </p>
      </div>

      <!-- Schedule Changes -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px;">Schedule Changes</h2>
        
        <!-- Old Schedule -->
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600; text-decoration: line-through;">Previous Schedule:</p>
          <p style="margin: 4px 0; color: #78350f;">
            <strong>Date:</strong> ${new Date(oldDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p style="margin: 4px 0; color: #78350f;">
            <strong>Time:</strong> ${oldTime}
          </p>
        </div>

        <!-- Arrow Divider -->
        <div style="text-align: center; margin: 15px 0;">
          <span style="display: inline-block; background: #f59e0b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
            ⬇️ Changed To ⬇️
          </span>
        </div>

        <!-- New Schedule -->
        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border: 2px solid #16a34a;">
          <p style="margin: 0 0 10px 0; color: #166534; font-weight: 600;">✅ New Schedule:</p>
          <p style="margin: 4px 0; color: #166534;">
            <strong>Date:</strong> ${new Date(newDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p style="margin: 4px 0; color: #166534;">
            <strong>Time:</strong> ${newTime}
          </p>
        </div>
      </div>

      ${appointment.notes ? `
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Additional Notes</h3>
        <p style="margin: 0; color: #374151;">${appointment.notes}</p>
      </div>
      ` : ''}

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
            Your appointment has been confirmed for the new date and time
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
            Add the new schedule to your calendar
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
            We'll send you a reminder before your appointment
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need to Make Changes?</h3>
        <p style="margin: 0; color: #4b5563;">
          If you need to cancel or reschedule again, please contact us:
          <br>
          📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">My Appointments</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Contact Support</a>
      </div>
    </div>
  </div>
`;

export const getMeetingLinkEmailTemplate = (appointment, meetingLink) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🔗 Meeting Link Updated</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Propertia Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Alert Box -->
      <div style="background: #dbeafe; border: 2px solid #2563eb; padding: 15px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <p style="margin: 0; color: #1e40af; font-weight: 600;">
          ✅ Your appointment now includes a virtual meeting link
        </p>
      </div>

      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Location:</strong> ${appointment.propertyId.location || 'N/A'}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #dcfce7; color: #166534;">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
        </p>
      </div>

      <!-- Meeting Link Section -->
      <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 30px; border: 2px solid #2563eb;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; text-align: center;">Virtual Meeting Access</h3>
        <p style="margin: 0 0 20px 0; color: #4b5563; text-align: center;">Click the button below to join your virtual property viewing:</p>
        <div style="text-align: center;">
          <a href="${meetingLink}" 
             style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #2563eb, #1e40af); 
                    color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3); transition: all 0.3s ease;">
            🎥 Join Meeting
          </a>
        </div>
        <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; text-align: center;">
          Or copy this link: <a href="${meetingLink}" style="color: #2563eb; word-break: break-all;">${meetingLink}</a>
        </p>
      </div>

      <!-- Important Notes -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📝 Important Notes</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">1</span>
            Join the meeting 5 minutes before the scheduled time
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">2</span>
            Ensure you have a stable internet connection
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">3</span>
            Test your camera and microphone before joining
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #2563eb;">4</span>
            Keep the meeting link private and secure
          </li>
        </ul>
      </div>

      </div>

       <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@propertia.com" style="color: #2563eb; text-decoration: none;">support@propertia.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 (021) 567-567</a>
        </p>
      </div>

   <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Propertia. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;