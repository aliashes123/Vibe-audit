@app.post("/api/audit/{repo_slug}")
async def run_audit(repo_slug: str):
    audit_id = str(uuid.uuid4())
    
    # Queue full scan
    run_full_audit.delay(audit_id, repo_slug)
    
    return {"audit_id": audit_id, "status": "queued"}

@celery.task
def run_full_audit(audit_id: str, repo_slug: str):
    modules = {
        "secrets": scan_secrets(repo_slug),
        "dependencies": scan_dependencies(repo_slug),
        "config": check_github_config(repo_slug),
        "code_patterns": scan_code_patterns(repo_slug),
        "workflows": audit_workflows(repo_slug),
        "branches": check_branches(repo_slug),
        "policy": check_security_policy(repo_slug)
    }
    
    findings = []
    total_score = 100
    
    for module, results in modules.items():
        findings.extend(results.findings)
        total_score -= results.score_delta
    
    save_audit(audit_id, repo_slug, total_score, findings, modules)
