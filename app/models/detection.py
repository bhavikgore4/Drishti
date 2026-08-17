import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.db.session import Base

class DetectionLog(Base):
    __tablename__ = "detection_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(64), index=True, nullable=False)
    detected_objects = Column(JSONB, nullable=False)
    primary_alert = Column(Text, nullable=True)
    urgency_level = Column(String(16), default="low")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SceneMemory(Base):
    __tablename__ = "scene_memories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(64), index=True, nullable=False)
    description = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=True)  # 384-dim for MiniLM / sentence embeddings
    created_at = Column(DateTime(timezone=True), server_default=func.now())