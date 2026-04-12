# Setup Guide

Complete installation guide for a new machine. Follow every step in order.

---

## Step 1 — Install Node.js

The MCP server runs via `npx`, which comes with Node.js.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (e.g. 20.x or 22.x)
3. Run the installer — accept all defaults
4. Verify: open a terminal and run:
   ```
   node --version
   npm --version
   ```
   Both should print version numbers.

---

## Step 2 — Install Power BI Desktop

Power BI Desktop is free and Windows-only.

**Option A — Microsoft Store (recommended, auto-updates):**
1. Open Microsoft Store
2. Search for "Power BI Desktop"
3. Click Install

**Option B — Direct download:**
1. Go to [https://www.microsoft.com/en-us/download/details.aspx?id=58494](https://www.microsoft.com/en-us/download/details.aspx?id=58494)
2. Download and run the installer

**Verify:** Open Power BI Desktop. You should see the start screen. Close it for now.

---

## Step 3 — Install Claude Code

1. Follow the [Claude Code installation guide](https://docs.anthropic.com/en/docs/claude-code)
2. Authenticate with your Anthropic account
3. Verify: run `claude` in a terminal — the Claude Code CLI should start

---

## Step 4 — Clone or download this project

```bash
git clone https://github.com/<your-repo>/powerbi-claude.git
cd powerbi-claude
```

Or download the ZIP and extract it.

---

## Step 5 — Verify the MCP config

The file `.mcp.json` is already in the project root. Open it and confirm it looks like this:

```json
{
  "mcpServers": {
    "powerbi-modeling": {
      "command": "npx",
      "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--skipconfirmation"]
    }
  }
}
```

Do not change this file. The `--skipconfirmation` flag is critical — without it, all model write operations will fail.

---

## Step 6 — Open Claude Code from the project folder

**This step is critical.** Claude Code only loads `.mcp.json` if it is started from the directory that contains it.

```bash
cd path/to/powerbi-claude
claude
```

Or in VS Code: open the `powerbi-claude` folder, then open the integrated terminal and run `claude`.

---

## Step 7 — Verify MCP is connected

When Claude Code starts, the MCP server launches automatically via `npx`. To verify it started correctly:

In VS Code: open the Command Palette (`Ctrl+Shift+P`) → **MCP: List Servers** → click **Show Output** next to `powerbi-modeling`.

Look for this line in the output:
```
Skip Confirmation: Enabled
```

If you see `Skip Confirmation: Disabled` or the server isn't listed, see [MCP not working](#mcp-not-working) below.

---

## Step 8 — Test the connection

1. Open Power BI Desktop
2. Create a new blank report (File → New)
3. In Claude Code, ask: *"List the local Power BI Desktop instances"*
4. Claude will call `connection_operations → ListLocalInstances` and should return the running instance

If it returns the instance, everything is working. You're ready to build dashboards.

---

## MCP not working

### Symptom: all write operations fail with "user declined to confirm"

**Cause:** Missing `--skipconfirmation` flag, or the VS Code window hasn't been reloaded since the flag was added.

**Fix:**
1. Confirm `.mcp.json` has `--skipconfirmation` (see Step 5)
2. Reload the VS Code window: `Ctrl+Shift+P` → **Developer: Reload Window**
3. Check the MCP output log for `Skip Confirmation: Enabled`

**Why restarting the MCP panel doesn't work:** Claude Code and the VS Code Copilot extension run **separate** MCP server processes. Restarting from the VS Code MCP panel only restarts Copilot's server. Claude Code's server only picks up config changes on a full window reload.

### Symptom: MCP server not listed / not starting

**Cause:** Node.js not installed, or `npx` not in PATH.

**Fix:**
1. Open a terminal and run `npx --version`
2. If not found, reinstall Node.js (Step 1) and ensure "Add to PATH" is checked during install
3. Restart VS Code completely after installing Node.js

### Symptom: `ListLocalInstances` returns empty

**Cause:** Power BI Desktop is not open, or opened after Claude Code started.

**Fix:** Open Power BI Desktop with a file loaded, then try again. The MCP server connects to the running Desktop process — it must be open first.

---

## First run checklist

Before starting a dashboard build, confirm:

- [ ] Node.js installed (`node --version` works)
- [ ] Power BI Desktop installed and opens correctly
- [ ] Claude Code running from the `powerbi-claude` directory
- [ ] MCP output log shows `Skip Confirmation: Enabled`
- [ ] Power BI Desktop is open with a blank file
- [ ] `ListLocalInstances` returns the running instance
