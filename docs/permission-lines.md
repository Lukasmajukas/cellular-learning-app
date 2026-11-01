# 🔑 Making the robot hands-free (task T21)

**Why:** Sometimes Claude's safety check stops a chat and asks "approve this?". The robot works with nobody watching, so it would sit and wait. Only you can do these steps, because Claude isn't allowed to give itself permissions.

**Status (Oct 31): done.** You did steps 1 and 3. Step 2 turned out to be impossible on your account, so skip it.

**Found on Nov 1 (task T44):** in Auto mode, three of these lines are never used: `create_session` (opening a chat), `fire_trigger` (starting the next robot run) and `archive_session` (putting chats away). Claude's safety check always decides those itself. So you typed your approval for the robot in chat, and it's written word for word in `CLAUDE.md`, which the safety check reads. The lines can stay: they still help in the other modes.

## Step 1. If a robot chat is waiting on you right now
Open the chat called **Robot run** in your chat list. If it says it needs your approval, click **Approve**. (`Robot status` in any chat tells you if one is waiting. The robot also pings your phone.)

## Step 2. Page-publishing tools: not possible on your account (skip)
Checked on Oct 31: the "Publish Files" question comes from a tool built into Claude, not from one of your connectors. Your connectors are Apple Music, Clinical Trials, Gmail, Google Calendar, Docs, Drive, Sheets, Slides and Indeed, so there's no switch for you to flip. What changed instead: robot chats no longer publish the progress page, so they can't get stuck on it. When you're in a chat with Claude, it refreshes the page and you click **Approve** once. Task T39 looks for a hands-free way.

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
