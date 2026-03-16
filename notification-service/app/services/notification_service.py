from app.services.email_service import send_email


EMAIL_KEYS = ("email", "user_email", "recipient_email")
EVENT_NAME_KEYS = ("eventName", "event_name", "title")


def _first_present(event, keys):
    for key in keys:
        value = event.get(key)
        if value:
            return value
    return None


def process_notification(event):
    event_type = event.get("type")
    recipient_email = _first_present(event, EMAIL_KEYS)
    event_name = _first_present(event, EVENT_NAME_KEYS)

    if not event_type:
        print("Skipping notification: missing event type")
        return

    if not recipient_email:
        print("Skipping notification: missing recipient email")
        return

    if event_type == "user.registered":
        subject = "Welcome"
        message = "Your registration was successful"
        send_email(recipient_email, subject, message)

    elif event_type == "event.registration.success":
        if not event_name:
            print("Skipping notification: missing event name")
            return
        subject = "Event Registration"
        message = f"You registered for {event_name}"
        send_email(recipient_email, subject, message)

    elif event_type == "payment.success":
        if not event_name:
            print("Skipping notification: missing event name")
            return
        subject = "Payment Successful"
        message = f"Payment successful for {event_name}"
        send_email(recipient_email, subject, message)

    else:
        print(f"Skipping notification: unsupported event type '{event_type}'")
