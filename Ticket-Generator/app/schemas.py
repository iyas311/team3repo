from pydantic import BaseModel, ConfigDict
from datetime import datetime

class TicketResponse(BaseModel):
    id: str
    booking_id: str
    event_id: str
    user_id: str
    qr_code: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
