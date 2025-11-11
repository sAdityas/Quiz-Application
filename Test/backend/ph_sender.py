import requests
import random

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_msg91(phone_number, otp,use_sandbox):
    if use_sandbox:
        print('www')
        return True
    else:
        url = "https://control.msg91.com/api/v5/otp"

        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        payload = {
            'widgetId' : "35676a6a4144383237393934",
            "authkey": "459670AGnOXQnRX686f9055P1",               # ← Your MSG91 Auth Key
            "template_id": "686f9356d6fc05732e1fff23",        # ← Template ID created in MSG91
            "mobile": phone_number,                   # ← e.g. '919812345678'
            "otp": otp,
            "sender": "TSTOTP",                     # ← 6-character Sender ID (approved)
            "otp_length": "6",
            "otp_expiry": "5"                         # Optional: expires in 5 mins
        }

        response = requests.post(url, json=payload, headers=headers)
        print(response.json())
        return response.status_code == 200

# Example usage
otp = generate_otp()
number = '919370835205'  # Mobile number with country code (India = 91)
sent = send_otp_msg91(number, otp,use_sandbox=True)

if sent:
    print(f"✅ OTP {otp} sent to {number}")
else:
    print("❌ Failed to send OTP.")
