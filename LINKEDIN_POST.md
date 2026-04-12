# LinkedIn Post

---

I built an AI agent that creates Power BI dashboards from scratch. Here's what happened.

Last week I got curious: how far could I push Claude Code + an MCP server to automate the most tedious parts of data work?

The answer: from a raw CSV file to a working, styled dashboard in under 30 minutes.

Here's the exact breakdown:

**~15 min** — First-time setup (Node.js, Power BI Desktop, MCP config)
**~5 min** — Describe your data and what you want to see
**~10 min** — Agent builds everything automatically

After that first setup, every new dashboard takes about 15 minutes total.

What the agent actually does:

→ Reads your CSV files and infers tables, column types, and relationships
→ Connects directly to Power BI Desktop via the powerbi-modeling-mcp server
→ Builds the full semantic model — tables, data types, DAX measures
→ Writes all the report JSON files: pages, visuals, layout, theme
→ Delivers a .pbip project you just open and it works

No manual model building. No dragging fields onto charts. No formatting.

The hardest part wasn't the AI — it was reverse-engineering Power BI's PBIR file format. The documentation barely covers it. Most of the patterns in this project were discovered by having Power BI Desktop generate a visual, then reading the output file to learn the exact structure. Every finding is documented so the agent never has to guess twice.

The stack:
→ Claude Code (claude-sonnet-4-6)
→ @microsoft/powerbi-modeling-mcp — talks directly to Power BI Desktop's Analysis Services engine
→ PBIP format — human-readable JSON project files that Power BI opens natively

The whole thing is open source. Clone it, drop in your CSV, and describe your dashboard.

→ github.com/allanbrunorj/powerbi-claude

The next step is making this work for multi-table datasets with relationships and time intelligence. The foundation is there — the agent already handles star schemas and Calendar tables.

If you work with data and spend more time building reports than analyzing them, this might save you a few hours a week.

---

*Built with Claude Code + powerbi-modeling-mcp*
*#PowerBI #AI #ClaudeCode #DataAnalytics #Automation #OpenSource*
