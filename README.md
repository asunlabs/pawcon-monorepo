<div align="center">
  <img src="https://user-images.githubusercontent.com/83855174/170878476-fb6069e6-9463-444f-b8f6-5bf05e77b0cf.png" alt="pawcon project logo" width="100%"/>
</div>

<div align="center">
<br/>

<!-- prettier-ignore -->
|Before migration|After migration|
|:--------------:|:-------------:|
|[![wakatime](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/b1b2013f-a6ca-41d1-a14f-101a6d202f49.svg)](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/b1b2013f-a6ca-41d1-a14f-101a6d202f49)|[![wakatime](https://wakatime.com/badge/github/asunlabs/pawcon-monorepo.svg)](https://wakatime.com/badge/github/asunlabs/pawcon-monorepo)|

<img src="https://img.shields.io/badge/version-v0.2.0-red" alt="version0.2.0" /> &nbsp; [![Netlify Status](https://api.netlify.com/api/v1/badges/bd81d367-6c26-4c58-a953-f851466d6662/deploy-status)](https://app.netlify.com/sites/pawcon/deploys) &nbsp; ![Heroku](https://img.shields.io/badge/heroku-APIsontheway-darkgreen?style=square&logo=heroku&logoColor=white) &nbsp;

<br/>
</div>

**NOTICE**

Being migrated from [here](https://github.com/developerasun/pawcon)

<details>
<summary>Breaking changes</summary>

- Adopting Turborepo/monorepo with pnpm package manager
- Apps devided into 1) client 2) server 3) blockchain 4) unity
- Prettier adopted
- Redux toolkit adopted
- Nest.js,swagger adopted
- Upgradeable, chainlink oracle, and Pinata SDK and dedicated gateway adopted
</details>

## Convention

Take a look at convention.md in each app to check code conventions.

For git convention, check out below shell script and copy and paste in your .git directory.

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

**Useful resouces**

You can check dev resources from below.

- [Pawcon dockerhub](https://hub.docker.com/repository/docker/developerasun/pawcon-monorepo)
