import smtplib
import random
from email.mime.text import MIMEText

def generate_otp():
    """Generates a simple 6-digit OTP."""
    return str(random.randint(100000, 999999))

def send_otp_email(recipient_email, otp):
    """Sends the OTP to the specified email address."""
    sender_email = "aditya.sarkale@trackcomponents.in"  # Replace with your email
    sender_password = "caxt vgts xlhi gkjw"    # Replace with your App Password

    msg = MIMEText(f"Your One-Time Password (OTP) is: {otp}")
    msg['Subject'] = "Your 2FA Code"
    msg['From'] = sender_email
    msg['To'] = recipient_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp: # Use your SMTP server and port
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
        print(f"OTP sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False

# Example Usage:
user_email = "adisarkale@gmail.com"
otp_code = generate_otp()

if send_otp_email(user_email, otp_code):
    print("DONE")