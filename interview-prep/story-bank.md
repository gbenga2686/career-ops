# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Observability] MTTD reduction at William Hill
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** High-traffic betting platform with noisy alerts and high mean time to detect — teams were drowning in false positives and real incidents were buried.
**T:** Reduce MTTD and improve incident signal quality across the production environment.
**A:** Deployed full-stack observability: Prometheus, Grafana, Loki, DataDog, CloudWatch — tuned alerting thresholds, built dashboards per service, improved runbooks with clear escalation paths.
**R:** Cut MTTD by [X]%. On-call was meaningfully less painful; signal-to-noise ratio improved significantly.
**Reflection:** Observability is a team discipline, not an SRE silo. Should have involved devs in defining SLIs and alert thresholds from the start instead of retrofitting.
**Best for questions about:** monitoring, incident response, on-call, SRE tooling, reducing toil

---

### [IaC] Multi-environment Terraform at William Hill
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** Multi-environment AWS infra was managed inconsistently, causing config drift between dev, staging, and production.
**T:** Codify all environments into reproducible Infrastructure as Code, enforced via CI/CD.
**A:** Built out Terraform + Ansible across all environments, with CI/CD enforcement preventing manual drift. Structured modules for reusability.
**R:** Reduced provisioning time by [X]%; eliminated environment parity bugs.
**Reflection:** Terraform state management is first-class infrastructure — not an afterthought. Remote state with locking should be set up before writing a single resource block.
**Best for questions about:** IaC, Terraform, environment management, DevOps maturity

---

### [Kubernetes] EKS zero-downtime deployments at William Hill
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** Multiple services running on EKS with manual scaling gaps causing performance issues under peak betting events.
**T:** Enable zero-downtime deployments and elastic scaling without manual intervention.
**A:** Configured HPA + cluster autoscaler + ArgoCD GitOps workflow; standardised Helm chart versioning with a release process.
**R:** Zero-downtime deploys achieved; platform handled peak traffic without manual scaling.
**Reflection:** Helm chart versioning needs a formal release process from day one — unversioned charts caused config drift across environments.
**Best for questions about:** Kubernetes, GitOps, ArgoCD, Helm, zero-downtime deployments

---

### [CI/CD] GitLab pipelines at Huawei
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** Multiple services with manual, error-prone releases across environments at Huawei.
**T:** Design and own end-to-end deployment pipelines for [N] services.
**A:** Built staged GitLab CI/CD pipelines: dev to staging to prod, with automated rollback and approval gates.
**R:** Increased deployment frequency by [X]%; reduced deployment failures significantly.
**Reflection:** Should have added canary releases earlier. Big-bang deploys are risky even with fast rollback — traffic-split deployment strategies remove a category of risk entirely.
**Best for questions about:** CI/CD, deployment automation, DevOps ownership, release management

---

### [Security] AWS IAM least-privilege hardening
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** IAM permissions were over-provisioned across production services, flagged as a compliance risk.
**T:** Tighten access controls without breaking running services.
**A:** Audited all IAM roles, restructured to least-privilege, tightened VPC security groups, validated against service dependencies.
**R:** Passed internal audit; eliminated excess permissions across production.
**Reflection:** Least-privilege is a design constraint that must be built into IaC from day one. Retrofitting IAM is painful — every service has grown accustomed to its excess permissions.
**Best for questions about:** security, AWS IAM, compliance, access controls, regulated environments

---

### [Structured Logging] Log pipeline at William Hill
**Source:** Report #010 — Hazelcast — Senior Cloud SRE
**S:** API Gateway and CloudFront generating unstructured logs; Splunk ingestion was noisy and incident investigation was slow.
**T:** Improve log signal-to-noise to reduce incident investigation time.
**A:** Designed structured logging pipeline for API Gateway and CloudFront integrated with Splunk, with defined log schemas and alerting rules.
**R:** Reduced incident investigation time by [X]%.
**Reflection:** Schema-on-write beats schema-on-read. Define your log structure at emit time — searching through unstructured logs at 2am under incident pressure is avoidable pain.
**Best for questions about:** observability, logging, Splunk, incident response, structured data

---

### [SLO Ownership] Availability and SLA ownership at William Hill
**Source:** Report #011 — ENSEK — Senior Site Reliability Engineer
**S:** High-traffic betting platform with implicit SLA requirements but no formally defined SLOs or error budget policy — reliability was reactive, not engineered.
**T:** Own availability targets and ensure services meet them in a measurable, defensible way.
**A:** Established monitoring baselines across key services, defined alert thresholds aligned to SLA commitments, created runbooks with explicit SLA targets and escalation paths, introduced MTTD/MTTR tracking as primary reliability KPIs.
**R:** Sustained [X]% availability; MTTD and MTTR both measurably improved. On-call became structured rather than ad-hoc.
**Reflection:** SLOs need teeth. Without an error budget policy, they're just aspirations. The hard part isn't defining the SLO — it's getting product and engineering to agree on what to do when you're burning budget.
**Best for questions about:** SLOs, SLAs, reliability ownership, incident management, SRE culture

---

### [Platform Ownership] EKS platform end-to-end at William Hill
**Source:** Report #014 — Arc IT Recruitment — Platform Engineer (AWS)
**S:** High-traffic betting platform running 25 services on EKS with manual scaling gaps and no standardised release process.
**T:** Own the entire EKS platform — zero-downtime deployments, elastic scaling, GitOps workflow.
**A:** Configured HPA + Cluster Autoscaler for elastic scaling; implemented ArgoCD GitOps workflow; standardised Helm chart versioning with a formal release process.
**R:** Zero-downtime deployments achieved across 25 services; platform handled peak traffic without manual intervention.
**Reflection:** Helm versioning needs a formal release process from day one — unversioned charts caused config drift across environments. Treat chart releases like software releases.
**Best for questions about:** Platform Engineering, Kubernetes, EKS, GitOps, ArgoCD, Helm, zero-downtime deployments, platform ownership

---

### [Toil Reduction] Operational automation at William Hill
**Source:** Report #011 — ENSEK — Senior Site Reliability Engineer
**S:** SRE team spending significant capacity on repetitive operational tasks (certificate renewals, routine checks, manual deploys) that added no reliability value.
**T:** Eliminate toil to free engineering capacity for reliability improvements.
**A:** Audited recurring manual tasks, prioritised by frequency and time cost, then scripted [N]+ tasks in Bash and Python, integrating them into scheduled jobs and CI/CD triggers.
**R:** Eliminated [X] hours/week of manual work. Team capacity shifted toward proactive reliability engineering.
**Reflection:** Toil auditing should be a quarterly ritual — toil creep is invisible until it's a crisis. The audit itself often surfaces hidden risks (manual processes that bypass safeguards) beyond just efficiency wins.
**Best for questions about:** toil reduction, automation, SRE culture, operational efficiency, scripting
