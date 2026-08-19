"""Deterministic, local baseline for DRISHTI grievance triage.

This is intentionally transparent: it is a runnable prototype replacement for
the dashboard's former client-side mock and can later be swapped for a trained
classifier without changing the HTTP contract.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TriageRule:
    label: str
    ministry: str
    category: str
    sub_category: str
    priority: str
    keywords: tuple[str, ...]


RULES = (
    TriageRule(
        "Disaster Relief / Urban Inundation & Flood Emergency",
        "Ministry of Home Affairs / NDMA",
        "Disaster Relief & Emergency Response",
        "Immediate Rescue Boat Deployment & Dewatering",
        "urgent",
        ("flood", "water", "rain", "boat", "drain", "inundation", "overflow", "dewater"),
    ),
    TriageRule(
        "Highway Damage & Landslide Emergency",
        "Ministry of Road Transport and Highways",
        "National Highway Repair & Landslide Clearance",
        "Immediate Debris Clearance & Heavy Machinery Access",
        "high",
        ("road", "bridge", "highway", "landslide", "traffic", "pothole", "collapse"),
    ),
    TriageRule(
        "EPFO Public Service Grievance",
        "Labour and Employment",
        "Employee Provident Fund Organisation",
        "Delay or non-settlement of PF Advance",
        "medium",
        ("provident", "pension", "salary", "labour", "pf", "uan"),
    ),
    TriageRule(
        "Emergency Health & Medical Relief",
        "Ministry of Health and Family Welfare",
        "Public Health Emergency & Epidemic Prevention",
        "Mobile Health Clinic Deployment",
        "high",
        ("health", "hospital", "medicine", "doctor", "ambulance", "medical"),
    ),
)

DEFAULT_RULE = TriageRule(
    "General Grievance / Emergency Triage",
    "Ministry of Home Affairs / NDMA",
    "Disaster Relief & Emergency Response",
    "General Public Safety & Relief Grant",
    "medium",
    (),
)


def triage(description: str, filename: str | None = None) -> dict[str, object]:
    text = f"{description} {filename or ''}".lower()
    scored = [(sum(text.count(keyword) for keyword in rule.keywords), rule) for rule in RULES]
    score, rule = max(scored, key=lambda item: item[0])
    if score == 0:
        rule = DEFAULT_RULE

    signals = [keyword for keyword in rule.keywords if keyword in text]
    confidence = round(min(0.97, 0.55 + (0.1 * score)), 2) if score else 0.4
    return {
        "label": rule.label,
        "ministry": rule.ministry,
        "category": rule.category,
        "subCategory": rule.sub_category,
        "priority": rule.priority,
        "confidence": confidence,
        "signals": signals,
        "engine": "keyword-baseline-v1",
    }
