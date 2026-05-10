from pydantic import BaseModel
from typing import List
from enum import Enum

class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high" 
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class Finding(BaseModel):
    id: str
    module: str
    title: str
    severity: Severity
    confidence: float  # 0.0-1.0
    impact: str
    likelihood: str
    evidence: str
    affected_files: List[str]
    why_it_matters: str
    remediation: List[str]
    score_delta: int
    references: List[str]

class AuditResult(BaseModel):
    repo_slug: str
    score: int
    findings: List[Finding]
    modules: dict[str, dict]
