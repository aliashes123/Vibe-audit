'use client'
import { useQuery } from '@tanstack/react-query'

export default function AuditResults({ params }: { params: { repo: string } }) {
  const repoSlug = atob(params.repo)
  
  const { data: audit } = useQuery({
    queryKey: ['audit', repoSlug],
    queryFn: () => fetch(`/api/audit/${encodeURIComponent(repoSlug)}`).then(r => r.json())
  })

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Score Hero */}
      <section className="pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-3 bg-brand-card/50 px-8 py-4 rounded-2xl border border-brand-border mb-8">
          <div className="w-3 h-3 bg-brand-primary rounded-full animate-pulse"></div>
          <span className="text-sm uppercase tracking-wide text-brand-muted">Audit Complete</span>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-8xl font-black bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            {audit?.score || 68}
          </div>
          <div className="text-2xl font-medium text-brand-muted">/ 100 Security Score</div>
          <div className="text-4xl font-black text-brand-text">Medium Risk</div>
        </div>
      </section>

      {/* Charts Row */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          [chart:46]
          [chart:47]
        </div>
      </section>

      {/* Findings Feed */}
      <section className="max-w-4xl mx-auto px-6 space-y-8 pb-24">
        {audit?.findings.map((finding: any) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </section>
    </div>
  )
}

function FindingCard({ finding }: { finding: any }) {
  return (
    <div className="group bg-brand-card border border-brand-border rounded-3xl p-8 hover:border-brand-primary/50 transition-all hover:shadow-2xl">
      <div className="flex items-start gap-6 mb-6">
        <div className={`w-3 h-12 rounded-lg ${finding.severity === 'high' ? 'bg-brand-danger' : 'bg-brand-accent'}`}></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black">{finding.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${finding.severity === 'high' ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-accent/20 text-brand-accent'}`}>
              {finding.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-brand-muted leading-relaxed">{finding.why_it_matters}</p>
        </div>
      </div>
      
      {/* Evidence + Fix */}
      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-brand-border">
        <div>
          <h4 className="font-bold mb-4 text-brand-text">Evidence</h4>
          <pre className="bg-brand-surface/50 p-4 rounded-2xl text-sm font-mono text-brand-muted overflow-auto max-h-32">
            {finding.evidence}
          </pre>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-brand-text">Fix (2 min)</h4>
          <div className="space-y-3">
            {finding.remediation.map((step: string) => (
              <div key={step} className="flex items-start gap-3 p-3 bg-brand-surface/50 rounded-xl group-hover:bg-brand-primary/5">
                <span className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">1</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
