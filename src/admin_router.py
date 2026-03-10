import json
import os
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from src.config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin"])
_logger = logging.getLogger(__name__)

CONFIG_PATH = "data/admin_settings.json"

class AdminSettingsUpdate(BaseModel):
    api_key: Optional[str] = None
    api_base: Optional[str] = None
    model: Optional[str] = None
    admin_password: Optional[str] = None

def save_persistent_settings(data: dict):
    os.makedirs("data", exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def load_persistent_settings():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            _logger.error(f"Failed to load admin settings: {e}")
    return {}

# Load on startup
persisted = load_persistent_settings()
if persisted.get("api_key"):
    settings.api_key = persisted["api_key"]
if persisted.get("api_base"):
    settings.api_base = persisted["api_base"]
if persisted.get("model"):
    settings.model = persisted["model"]
if persisted.get("admin_password"):
    settings.admin_password = persisted["admin_password"]

async def verify_admin(x_admin_password: str = Header(...)):
    if x_admin_password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid admin password")
    return True

@router.get("/settings")
async def get_admin_settings(authorized: bool = Depends(verify_admin)):
    return {
        "api_key": settings.api_key[:8] + "..." if settings.api_key else "",
        "api_base": settings.api_base,
        "model": settings.model,
        "admin_password_set": bool(settings.admin_password),
    }

@router.post("/settings")
async def update_admin_settings(
    update: AdminSettingsUpdate,
    authorized: bool = Depends(verify_admin)
):
    updates = {}
    if update.api_key is not None:
        settings.api_key = update.api_key
        updates["api_key"] = update.api_key
    if update.api_base is not None:
        settings.api_base = update.api_base
        updates["api_base"] = update.api_base
    if update.model is not None:
        settings.model = update.model
        updates["model"] = update.model
    if update.admin_password is not None:
        if len(update.admin_password) < 6:
            raise HTTPException(status_code=400, detail="Password too short")
        settings.admin_password = update.admin_password
        updates["admin_password"] = update.admin_password

    # Persist
    current = load_persistent_settings()
    current.update(updates)
    save_persistent_settings(current)
    
    return {"message": "Settings updated successfully"}
