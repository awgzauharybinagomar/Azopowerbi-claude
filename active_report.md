# Active Report — ServiceReport-884eca63

This file records the report currently being worked on. Read this at the start of any session.

---

## Report identity

| Field | Value |
|---|---|
| **Workspace ID** | `2a77e123-9c0b-47fc-8e78-80961386c3d4` |
| **Report ID** | `884eca63-6084-4ca8-b375-dd9f9497c23f` |
| **Default page** | `ReportSection` |
| **Service URL** | https://app.powerbi.com/groups/2a77e123-9c0b-47fc-8e78-80961386c3d4/reports/884eca63-6084-4ca8-b375-dd9f9497c23f/ReportSection?experience=power-bi |
| **Local project** | `azo-powerbi-projects/output/ServiceReport-884eca63/` |
| **PBIP file** | `ServiceReport-884eca63.pbip` |
| **Branch** | `claude/setup-powerbi-report-3eA7D` |

---

## Session start checklist

1. Read `azo-powerbi-projects/output/ServiceReport-884eca63/visual_registry.md`
2. Open Power BI Desktop with `ServiceReport-884eca63.pbip`
3. Confirm MCP log shows `Skip Confirmation: Enabled`
4. Run `connection_operations → ListLocalInstances` → `Connect`
5. Identify whether task needs MCP (model) or JSON edits (visuals only)

---

## Publishing back to Service

After making local changes:
1. Open `ServiceReport-884eca63.pbip` in Power BI Desktop
2. Sign in to your Power BI account (top right)
3. **Home → Publish**
4. Select workspace: `2a77e123-9c0b-47fc-8e78-80961386c3d4`
5. Overwrite the existing report when prompted

---

## What has been done

- [x] Feature branch `claude/setup-powerbi-report-3eA7D` created across all three repos
- [x] PBIP folder skeleton created in `azo-powerbi-projects/output/ServiceReport-884eca63/`
- [x] `report_config.json` created with Service identifiers
- [x] `visual_registry.md` template created (populate after connecting to Desktop)
- [ ] Semantic model connected and `model.bim` exported
- [ ] Pages and visuals fully mapped in `visual_registry.md`
- [ ] Data sources connected (CSV / SharePoint / database)
