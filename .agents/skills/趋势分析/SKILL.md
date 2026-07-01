---
name: apify-trend-analysis
description: Discover and track emerging trends across Google Trends, Instagram, Facebook, YouTube, Twitter/X, and TikTok to inform content strategy.
---

# Trend Analysis

Discover and track emerging trends using Apify Actors to extract data from multiple platforms.

## Prerequisites

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)
- `mcpc` CLI tool (for fetching Actor schemas)

**Note**: Environment setup is now automated in Step 0. The skill will check and install missing dependencies automatically.

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 0: Environment setup (auto-check)
- [ ] Step 1: Identify trend type (select Actor)
- [ ] Step 2: Fetch Actor schema (mcpc or REST API fallback)
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the analysis script
- [ ] Step 5: Summarize findings
```

### Step 0: Environment Setup (Auto-check)

**Check and install dependencies automatically:**

```bash
# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️ .env file not found. Please provide your APIFY_TOKEN."
  # Ask user for token and create .env file
fi

# Check if mcpc is installed
if ! command -v mcpc &> /dev/null; then
  echo "📦 Installing mcpc..."
  npm install -g @apify/mcpc
fi
```

**If user provides APIFY_TOKEN, create .env file:**
```bash
echo "APIFY_TOKEN=user_provided_token" > .env
```

### Step 1: Identify Trend Type

Select the appropriate Actor based on research needs:

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| **Google** |
| Search trends | `apify/google-trends-scraper` | Google Trends data |
| **Instagram** |
| Hashtag tracking | `apify/instagram-hashtag-scraper` | Hashtag content |
| Hashtag metrics | `apify/instagram-hashtag-stats` | Performance stats |
| Visual trends | `apify/instagram-post-scraper` | Post analysis |
| Trending discovery | `apify/instagram-search-scraper` | Search trends |
| Comprehensive tracking | `apify/instagram-scraper` | Full data |
| API-based trends | `apify/instagram-api-scraper` | API access |
| Engagement trends | `apify/export-instagram-comments-posts` | Comment tracking |
| **Facebook** |
| Product trends | `apify/facebook-marketplace-scraper` | Marketplace data |
| Visual analysis | `apify/facebook-photos-scraper` | Photo trends |
| Community trends | `apify/facebook-groups-scraper` | Group monitoring |
| **YouTube** |
| Video search | `apify/youtube-scraper` | Search videos by keyword |
| Channel videos | `streamers/youtube-channel-scraper` | Channel content |
| YouTube Shorts | `streamers/youtube-shorts-scraper` | Short-form trends |
| YouTube hashtags | `streamers/youtube-video-scraper-by-hashtag` | Hashtag videos |
| **Twitter/X** |
| Tweet search | `apify/twitter-scraper` | Search tweets by keyword |
| User tweets | `apify/twitter-user-scraper` | User timeline |
| Hashtag tracking | `apify/twitter-hashtag-scraper` | Hashtag trends |
| **TikTok** |
| TikTok hashtags | `clockworks/tiktok-hashtag-scraper` | Hashtag content |
| Trending sounds | `clockworks/tiktok-sound-scraper` | Audio trends |
| TikTok ads | `clockworks/tiktok-ads-scraper` | Ad trends |
| Discover page | `clockworks/tiktok-discover-scraper` | Discover trends |
| Explore trends | `clockworks/tiktok-explore-scraper` | Explore content |
| Trending content | `clockworks/tiktok-trends-scraper` | Viral content |

### Step 2: Fetch Actor Schema

**Method 1: Using mcpc (Recommended)**

```bash
export $(grep APIFY_TOKEN .env | xargs) && mcpc --json mcp.apify.com --header "Authorization: Bearer $APIFY_TOKEN" tools-call fetch-actor-details actor:="ACTOR_ID" | jq -r ".content"
```

**Method 2: REST API Fallback (if mcpc fails)**

If mcpc connection fails, use Apify REST API directly:

```bash
export $(grep APIFY_TOKEN .env | xargs) && curl -s "https://api.apify.com/v2/acts/ACTOR_ID?token=$APIFY_TOKEN" | jq '.data'
```

To get input schema:
```bash
export $(grep APIFY_TOKEN .env | xargs) && curl -s "https://api.apify.com/v2/acts/ACTOR_ID/input-schema?token=$APIFY_TOKEN" | jq '.'
```

Replace `ACTOR_ID` with the selected Actor (e.g., `apify/google-trends-scraper`).

This returns:
- Actor description and README
- Required and optional input parameters
- Output fields (if available)

### Step 3: Ask User Preferences

Before running, ask:
1. **Output format**:
   - **Quick answer** - Display top few results in chat (no file saved)
   - **CSV** - Full export with all fields
   - **JSON** - Full export in JSON format
2. **Number of results**: Based on character of use case

### Step 4: Run the Script

**Quick answer (display in chat, no file):**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT'
```

**CSV:**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.csv \
  --format csv
```

**JSON:**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.json \
  --format json
```

### Step 5: Summarize Findings

After completion, report:
- Number of results found
- File location and name
- Key trend insights
- Suggested next steps (deeper analysis, content opportunities)


## Error Handling

| Error | Solution |
|-------|----------|
| `APIFY_TOKEN not found` | Ask user to provide token, then create `.env` with `APIFY_TOKEN=your_token` |
| `mcpc not found` | Auto-install: `npm install -g @apify/mcpc` |
| `mcpc connection failed` | Use REST API fallback (Method 2 in Step 2) |
| `Actor not found` | Check Actor ID spelling, search available actors via API |
| `Run FAILED` | Ask user to check Apify console link in error output |
| `Timeout` | Reduce input size or increase `--timeout` parameter |
| `Permission denied` | Verify APIFY_TOKEN has correct permissions |
| `Rate limit exceeded` | Wait and retry, or upgrade Apify plan |

## Common Actor Input Examples

### Twitter/X Search (`apify/twitter-scraper`)
```json
{
  "searchTerms": ["kimi2.5"],
  "maxTweets": 50,
  "language": "en"
}
```

### YouTube Search (`apify/youtube-scraper`)
```json
{
  "searchKeywords": "kimi2.5",
  "maxResults": 50,
  "resultsPerPage": 20
}
```

### Google Trends (`apify/google-trends-scraper`)
```json
{
  "searchTerms": ["kimi2.5"],
  "timeRange": "today 3-m",
  "geo": "US"
}
```
