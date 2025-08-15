import os, logging
logger = logging.getLogger("otp_mail")

SENDER_MODE = os.getenv("OTP_SENDER", "debug")

def send_otp(email: str, code: str):
    if SENDER_MODE == "debug":
        logger.warning("OTP for %s -> %s", email, code)
