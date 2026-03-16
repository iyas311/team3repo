from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    type = Column(String)
    message = Column(String)
    channel = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)