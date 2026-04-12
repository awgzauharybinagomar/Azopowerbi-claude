# Power BI Dashboard Builder — AI Agent

Automatically build complete Power BI dashboards from CSV files using Claude Code and the Power BI Modeling MCP server. You describe your data and what you want to see — Claude reads the CSVs, builds the semantic model with DAX measures, and writes all the report visuals.

**No manual Power BI work required.** You end up with a `.pbip` project folder (or `.pbix` file) ready to open.

---

## What this does

1. Reads your CSV files and infers tables, columns, and relationships
2. Asks you what KPIs and visuals you need
3. Builds the full semantic model (tables, types, measures) via MCP directly into Power BI Desktop
4. Writes all the report JSON files (pages, visuals, theme, layout)
5. Delivers a working `.pbip` you open in Power BI Desktop

---

## Requirements

- **Windows PC** — Power BI Desktop is Windows-only
- **Claude Code** — [Install guide](https://docs.anthropic.com/en/docs/claude-code)
- **Node.js** — Required for the MCP server
- **Power BI Desktop** — Free, local only (no cloud subscription needed)
- **CSV files** — Your source data, accessible on local disk

---

## Setup (first time only)

See **[SETUP.md](SETUP.md)** for the complete step-by-step installation guide covering Node.js, Power BI Desktop, and MCP configuration.

---

## Quick start (after setup)

1. Open Power BI Desktop → create a blank new file (do not save it yet)
2. Open Claude Code in this project folder
3. Tell Claude: *"I want to build a dashboard from these CSV files: `C:\path\to\file.csv`"*
4. Claude will guide you through the rest

---

## Output formats

### Option A — PBIP folder (default, recommended)
The agent produces a `output/DashboardName.pbip` folder structure. Open it by double-clicking the `.pbip` file. Best for:
- Version control (all files are plain JSON/text)
- Iterating with Claude across sessions
- Keeping the dashboard editable

### Option B — Single `.pbix` file (for sharing)
After the PBIP opens correctly in Power BI Desktop:
1. **File → Save As**
2. Choose **Power BI Desktop file (*.pbix)**
3. Share the single `.pbix` file

The `.pbix` is a ZIP archive — it can't be built from scratch outside of Desktop, but exporting from PBIP takes one click.

---

## Project structure

```
powerbi-claude/
  .mcp.json              ← MCP server config (pre-configured, do not edit)
  README.md              ← This file
  SETUP.md               ← Installation guide
  CLAUDE.md              ← Agent instructions (read by Claude)
  WORKING_PATTERNS.md    ← Technical reference: every confirmed working pattern
  output/                ← Generated dashboards
    DashboardName.pbip
    DashboardName.Dataset/
    DashboardName.Report/
    visual_registry.md   ← Maps hex IDs to human names (auto-generated per dashboard)
```

---

## How it works

The agent uses two mechanisms:

| Task | Tool |
|---|---|
| Semantic model (tables, measures, relationships) | `powerbi-modeling-mcp` — talks to Power BI Desktop's Analysis Services engine over a local port |
| Report visuals (charts, slicers, cards) | Direct JSON file writes to the PBIP folder — Power BI Desktop reads these on open |

The MCP server (`@microsoft/powerbi-modeling-mcp`) is installed automatically by `npx` on first use — no manual install needed.

---

## Included example

The `output/TitanicDashboard.*` folders contain a fully working example dashboard built from `titanic.csv`. Open `output/TitanicDashboard.pbip` in Power BI Desktop to see the result.

---

## Troubleshooting

See the **Error Reference** table in [CLAUDE.md](CLAUDE.md#complete-error-reference) for every error encountered and its fix.

Most common issues:
- **MCP writes fail** → missing `--skipconfirmation` flag or VS Code window not reloaded. See [SETUP.md](SETUP.md#mcp-not-working).
- **Visuals blank** → wrong visual JSON format. See [WORKING_PATTERNS.md](WORKING_PATTERNS.md#8-pbir-visual-format-confirmed-working).
- **Theme not applied** → theme file naming issue. See [WORKING_PATTERNS.md](WORKING_PATTERNS.md).
