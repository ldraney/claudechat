# Claude Response Viewer

Real-time viewer that displays Claude Code responses in a browser window.

## Architecture

```
Claude Code  -->  Stop Hook  -->  Node.js Server  -->  Browser (SSE)
```

1. **Stop hook** (`~/.claude/hooks/response-viewer.js`) fires when Claude finishes responding
2. Hook reads transcript file, extracts last assistant message
3. POSTs to localhost:8847
4. Server pushes to connected browsers via Server-Sent Events

## Files

- `server.js` - Express server with SSE endpoint
- `index.html` - Browser UI
- `~/.claude/hooks/response-viewer.js` - Stop hook (lives outside repo)
- `~/.claude/settings.json` - Hook configuration (lives outside repo)

## Running

```bash
npm start
# Open http://localhost:8847
```

## Hook Setup

The Stop hook must be configured in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node C:/Users/drane/.claude/hooks/response-viewer.js"
      }]
    }]
  }
}
```

## Port

Default port is 8847. Change in `server.js` and the hook script if needed.
