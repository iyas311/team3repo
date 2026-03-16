from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import Ticket
from app.schemas import TicketResponse

router = APIRouter()

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ticket).filter(Ticket.id == ticket_id))
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    return ticket

@router.get("/user/{user_id}", response_model=List[TicketResponse])
async def get_user_tickets(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ticket).filter(Ticket.user_id == user_id))
    tickets = result.scalars().all()
    
    return tickets

@router.get("/verify/{ticket_id}")
async def verify_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ticket).filter(Ticket.id == ticket_id))
    ticket = result.scalars().first()
    if not ticket:
        return {"valid": False, "message": "Ticket not found or invalid"}
        
    return {"valid": True, "ticket_id": ticket_id, "event_id": ticket.event_id}
