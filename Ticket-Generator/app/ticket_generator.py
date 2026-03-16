import qrcode
import os
import uuid
import json
from datetime import datetime
from app.database import AsyncSessionLocal
from app.models import Ticket

QR_CODE_DIR = os.getenv("QR_CODE_DIR", "/service/qr_codes")
if not os.path.exists(QR_CODE_DIR):
    os.makedirs(QR_CODE_DIR, exist_ok=True)

async def generate_ticket(booking_id: str, event_id: str, user_id: str):
    ticket_id = f"TICKET-{str(uuid.uuid4())[:8].upper()}"
    
    qr_data = {
        "ticket_id": ticket_id,
        "booking_id": booking_id,
        "event_id": event_id,
        "user_id": user_id
    }
    
    # Generate QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json.dumps(qr_data))
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    qr_code_filename = f"{QR_CODE_DIR}/{ticket_id}.png"
    img.save(qr_code_filename)
    
    # Store in SQLAlchemy (PostgreSQL)
    async with AsyncSessionLocal() as session:
        try:
            new_ticket = Ticket(
                id=ticket_id,
                booking_id=booking_id,
                event_id=event_id,
                user_id=user_id,
                qr_code=qr_code_filename,
                created_at=datetime.utcnow()
            )
            session.add(new_ticket)
            await session.commit()
            print(f"Ticket {ticket_id} created and stored in Postgres successfully.")
        except Exception as e:
            await session.rollback()
            print(f"Failed to store ticket in DB: {e}")
