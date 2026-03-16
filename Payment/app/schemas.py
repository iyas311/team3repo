from pydantic import BaseModel
from datetime import datetime

class PaymentCreate(BaseModel):
    booking_id: str
    user_id: str
    event_id: str
    amount: float

class PaymentResponse(BaseModel):
    id: int
    booking_id: str
    user_id: str
    event_id: str
    amount: float
    status: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None