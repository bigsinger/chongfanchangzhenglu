# Codebase audit results log

## 2026-07-27 follow-up

- Coordinator: `ln-620-codebase-auditor`
- Context: `ln-620/2026-07-27/context.json`
- Consolidated report: `../codebase-audit-followup-2026-07-27.md`
- Scope: native offline Cocos game, published content, Android build/release, test automation
- Result: all high-priority findings that were safe and verifiable in the current workspace were implemented.

| Category | Initial | After implementation | Residual |
|---|---:|---:|---|
| Security | 8.8 | 9.2 | Current externally signed release still needs final artifact inspection |
| Build | 7.5 | 8.8 | Debug/release contract differs by design; formal signer is external |
| Dependencies | 6.5 | 7.6 | Creator 2.4.3 and its native toolchain remain end-of-life |
| Code principles | 5.8 | 6.5 | Two large gameplay controllers remain |
| Code quality | 5.2 | 8.0 | 440 recovered-content warnings remain baselined |
| Dead code | 6.6 | 7.5 | Further cleanup must avoid changing recovered event behavior |
| Observability | 6.0 | 7.5 | No native crash SDK/tombstone upload in this offline build |
| Concurrency | 6.0 | 8.5 | Remaining raw timers outside the highest-risk navigation paths |
| Lifecycle | 5.5 | 8.4 | Real-device memory matrix remains |

Runtime evidence:

- `npm test`: PASS
- debug Android dual-ABI build: PASS
- old-save `prop113` device migration: PASS
- pickup/card/close/permanent-save device path: PASS
- background recovery: PASS
- four-cycle map/background stability rerun after `STATE_DRAG` fix: PASS

The installed coordinator package did not include its referenced shared
`audit-common-contract.md`, `scoring.md`, `severity.md`, `audit-report.md`, or
`results-log.md` template files. Equivalent evidence tables and a persistent log
were used without inventing missing template contents.

