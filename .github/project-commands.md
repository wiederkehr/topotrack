# GitHub Project Board Commands

This document contains working commands for managing the TopoTrack project board via GitHub CLI.

## Project Information

- **Project Number**: 1
- **Owner**: wiederkehr
- **Project ID**: PVT_kwHNOyHOAFgQiA

## Status Field Options

The Status field (ID: `PVTSSF_lAHNOyHOAFgQiM4DhHth`) has these options:

- **Backlog**: `288099db`
- **Todo**: `f75ad846`
- **Doing**: `47fc9ee4`
- **Review**: `886aeac6`
- **Done**: `98236657`

## Common Commands

### List all projects

```bash
gh project list --owner wiederkehr
```

### View project fields

```bash
gh project field-list 1 --owner wiederkehr
```

### List project items

```bash
gh project item-list 1 --owner wiederkehr --limit 20
```

### Find an issue in the project

```bash
# Lists items and their project item IDs
gh project item-list 1 --owner wiederkehr --limit 50 | grep "Issue #<number>"
```

### Update issue status on project board

To move an issue through the workflow stages:

```bash
# Move to "Doing" when starting work
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 47fc9ee4

# Move to "Review" when creating PR
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 886aeac6

# Move to "Done" after PR is merged
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 98236657
```

### Get project item ID from issue number

```bash
# Get the project item ID for issue #37
gh project item-list 1 --owner wiederkehr --limit 50 | grep "Issue.*#37"
# Returns: Issue	[Title]	37	wiederkehr/topotrack	PVTI_lAHNOyHOAFgQiM4H5jQt
#                                                      ^^^ This is the item ID
```

## Workflow Commands

### Starting work on an issue

```bash
# 1. Find the item ID
ITEM_ID=$(gh project item-list 1 --owner wiederkehr --limit 50 --format json | \
  jq -r '.items[] | select(.content.number == 37) | .id')

# 2. Move to "Doing"
gh project item-edit \
  --id "$ITEM_ID" \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 47fc9ee4
```

### Creating a PR (move to Review)

```bash
# Get item ID and move to Review
ITEM_ID=$(gh project item-list 1 --owner wiederkehr --limit 50 --format json | \
  jq -r '.items[] | select(.content.number == 37) | .id')

gh project item-edit \
  --id "$ITEM_ID" \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 886aeac6
```

### After PR merge (move to Done)

```bash
# Get item ID and move to Done
ITEM_ID=$(gh project item-list 1 --owner wiederkehr --limit 50 --format json | \
  jq -r '.items[] | select(.content.number == 37) | .id')

gh project item-edit \
  --id "$ITEM_ID" \
  --project-id PVT_kwHNOyHOAFgQiA \
  --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
  --single-select-option-id 98236657
```

## Notes

- The `--project-id` parameter should be the **project ID** (PVT\_...), not the project number
- The `--field-id` parameter is the **Status field ID**
- The `--single-select-option-id` parameter is the **option ID** for the desired status
- Always get the latest item ID before updating, as IDs may change
