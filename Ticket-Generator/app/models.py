from sqlalchemy import Column, String, DateTime
from datetime import datetime
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True)
    booking_id = Column(String, index=True, nullable=False)
    event_id = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)
    qr_code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
