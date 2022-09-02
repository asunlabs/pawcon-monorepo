---
title: 'Git strategy'
draft: false
---

## Contents

1. [From creator](#from-creator)

1. [Git flow](#git-flow)

1. [Commit convention](#git-commit-convention)

1. [Git hooks](#git-hooks)

1. [Templates](#templates)

## From creator

PawCon actively uses git to optimize and keep code convention consistent. Please take a look at below documents what is configured and how it works.

## Git flow

PawCon adopts a git flow for branch strategy.

- Main branches(non-deletable): main, develop
- Support branches(deletable): feature, release, bugfix, hotfix, release

Most of time, I spend time in develop and feature branches, adding new features.

The develop branch is regularly merged into main branch. Note that branch names should be matched correctly as specified in [git hooks](#git-hooks)

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

## Templates

Using templates saves your time a lot by automating repetitive works.

**Issue template**

```yml
name: Bug Report
description: File a bug report
title: '[Bug]: '
labels: ['bug']
assignees:
  - developerasun
body:
  - type: markdown
    attributes:
      value: |
        @asunlabs/pawcon-monorepo bug report
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Describe what went wrong and what was supposed to happen
      placeholder: Enter your description here
      value: 'A bug happened!'
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
      render: shell
```

**Pull request template**

```md
# Pull request format

This is a PR format for PawCon project.

## What's changed

**description**

1.
1.

**Linked issue(optional)**: #

**Screenshot/Clips(optional)**

- content here

## Checklist

- [ ] Follow this project's commit convention
- [ ] Follow this project's branch strategy convention
- [ ] Set label and milestone
```
