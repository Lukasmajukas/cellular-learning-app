# 🔑 Permission lines for the robot (task T21)

**Why:** Claude's safety check sometimes stops a chat and asks you "approve opening a new chat?". The robot is meant to work with nobody watching, so it would just sit and wait. These lines tell the safety check "these jobs are always OK in this project". Only you can add them, because Claude isn't allowed to give itself permissions.

**What they allow, in plain words:** opening and starting chats (the robot's helpers and the next robot run), reading and opening pull requests (the "busy" signs), sending you a phone notification, and searching and reading web pages for research. They don't add anything else, and the schedule itself can't be changed with them.

**Steps (about 2 minutes, on your PC):**
1. Open this link: https://github.com/Lukasmajukas/cellular-learning-app/edit/main/.claude/settings.json
2. Copy the text in the box below. Click inside the big text box on the GitHub page, press **Ctrl+A** (select everything), then **Ctrl+V** (paste). The new text replaces the old.
3. Click the green **Commit changes…** button, then **Commit changes** again in the box that pops up.
4. Tell Claude: `done`. It checks that the file is right.

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
