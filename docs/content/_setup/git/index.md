---
title: 'Git strategy'
draft: false
---

# From creator

PawCon actively uses git to optimize and keep code convention consistent. Please take a look at below documents what is configured and how it works.

## Git flow

will be added

## Git commit convention

PawCon configures commit message template like below, which is based on [Pandas](https://pandas.pydata.org/docs/development/contributing.html#committing-your-code).

```
#ENH:
#BUG:
#DOC
#TST:
#BLD:
#PERF:
#TYP:
#CLN:

# =====================================
# ENH: Enhancement, new functionality
# BUG: Bug fix
# DOC: Additions/updates to documentation
# TST: Additions/updates to tests
# BLD: Updates to the build process/scripts
# PERF: Performance improvement
# TYP: Type annotations
# CLN: Code cleanup
# run this command in terminal: git config --local commit.template .gitmessage.txt
# =====================================
# find more details here: https://pandas.pydata.org/docs/development/contributing.html#committing-your-code
```

## Git hooks

PawCon configures prepare-commit-msg hook like below to keep branch name consistent. This is also connected to github actions workflows, which will be demonstrated in _git workflows_ section.

```sh
#!/bin/sh

# get current branch
currentBranchName="$(git rev-parse --abbrev-ref HEAD)"
validBranchName="^(feature|bugfix|hotfix|release)\/[a-z0-9._-]+\/[a-z0-9._-]+$"
message="Only valid branch name"

# force branch naming convention
# whitespace in shell script is important
if [[ ! $currentBranchName =~ $validBranchName ]]
then
    echo $message
    exit 1
fi
```

## Git workflows
