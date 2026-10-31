# 🔑 Making the robot hands-free (task T21)

**Why:** Sometimes Claude's safety check stops a chat and asks "approve this?". The robot works with nobody watching, so it would sit and wait. There are two places to say "this is always OK", and the robot needs both. Only you can do these steps, because Claude isn't allowed to give itself permissions.

## Step 1. If a robot chat is waiting on you right now
Open the chat called **Robot run** in your chat list. If it says it needs your approval, click **Approve**. (`Robot status` in any chat tells you if one is waiting. The robot also pings your phone.)

## Step 2. Allow the page-publishing tools for good (about 2 minutes)
The "Publish Files" question comes from the connector that publishes your progress page, so the fix is on claude.ai, not in the project:
1. Open https://claude.ai/customize/connectors
2. Find the connector with the tools **Publish Files**, **Publish Version**, **Edit Version** and **Pin Artifact**. The exact names may differ a little. Sign in again if it asks.
3. Set each of those tools to **Allowed** under its tool permissions.

If you can't find it, or "Allowed" isn't offered (an admin setting can cap it), tell Claude exactly what you see. Until this is done, every refresh of the progress page will stop and ask you.

## Step 3. Add the permission lines to the project (about 2 minutes)
These cover opening chats, starting the next robot run, reading and opening pull requests, the phone notification, and web research.
1. Open this link: https://github.com/Lukasmajukas/cellular-learning-app/edit/main/.claude/settings.json
2. Copy the text in the box below. Click inside the big text box on the GitHub page, press **Ctrl+A** (select everything), then **Ctrl+V** (paste). The new text replaces the old.
3. Click the green **Commit changes…** button, then **Commit changes** again in the box that pops up.
4. Tell Claude: `I added the permission lines`. It checks that the file is right.

**The text to paste** (your 5 old rules, plus 11 new ones; everything else is unchanged):

```json
{
  "permissions": {
    "allow": [
      "mcp__claude-code-remote__list_sessions",
      "mcp__claude-code-remote__get_session",
      "mcp__claude-code-remote__archive_session",
      "mcp__github__merge_pull_request",
      "mcp__github__update_pull_request",
      "mcp__claude-code-remote__create_session",
      "mcp__claude-code-remote__fire_trigger",
      "mcp__claude-code-remote__list_triggers",
      "mcp__claude-code-remote__subscribe_pr_activity",
      "mcp__claude-code-remote__unsubscribe_pr_activity",
      "mcp__github__list_pull_requests",
      "mcp__github__pull_request_read",
      "mcp__github__create_pull_request",
      "PushNotification",
      "WebSearch",
      "WebFetch"
    ]
  },
  "autoContinueAtUsageLimit": true,
  "modelSettings": {
    "claude-haiku-5-5": {
      "effortLevel": "low"
    },
    "claude-sonnet-5-5": {
      "effortLevel": "medium"
    },
    "claude-opus-5-5": {
      "effortLevel": "high"
    }
  }
}
```

**To undo it:** ask Claude in any chat to take the new lines out. Taking permissions away is allowed.
