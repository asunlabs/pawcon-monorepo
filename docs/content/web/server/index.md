---
title: 'Server overview'
draft: false
featured_image: '/images/web-banner.jpg' # the images dir means static.
tags: ['backend', 'webapp', 'centralization']
categories: ['web']
---

## Content

1. [Heads-up](#heads-up)

1. [Migration](#migration)
1. [Getting started](#getting-started)

   1. [Format](#format)
   1. [API](#api)
   1. [Running test](#running-test)
   1. [Extension](#extension)

1. [Auth](#auth)

   1. [Centralized Identity](#centralized-identity)
   1. [Decentralized Identity](#decentralized-identity)
      1. [Sign in with Ethereum - server](#sign-in-with-ethereum)
      1. [Self.id](#selfid)

## Heads-up

In version 0.2, PawCon targets to implement a server application with Node.js/Express, serving API and login authentication(JWT, Google Oauth, and Mongo DB). Check [here](https://github.com/developerasun/pawcon/tree/main/server#pawcon-server) to find out what were implemented.

What I'm focusing on server application is to mix decentralization and centralization. Supporting an aunthentication in a traditional way is important since _most of users still logins that way_. On top of that, DID is also important in terms of blockchain development.

## Migration

As project gets bigger and complicated, documentation and readmes were starting to be scattered. To avoid this, all docs will be maintained in a static website using HUGO.

## Getting started

Install dependencies

```sh
go install
```

Run fiber server with hot reload.

```sh
fiber dev
```

## Format

Run golines to for auto code formatting. Use -w flag to overwrite code.

Format an individual file.

```sh
golines -w ./server.go
```

Format all files.

```sh
golines -w ./
```

## API

In local, use curl for quick prototyping.

```sh
curl -method POST /api/path/here
```

## Running test

PawCon server application uses Ginkgo and Gomega.

```sh
go install github.com/onsi/ginkgo/v2/ginkgo
go get github.com/onsi/gomega
```

Generate test suite.

```sh
ginkgo bootstrap
```

Run test.

```sh
ginkgo --succinct
```

## Extension

will be added

## Auth

PawCon ver 0.3.0 targets to provide three ways for user authentication: 1) json web token 2) Google OAuth 3) Sign in with Ethereum. Each way will restrict user behaviors

Note that the last one is _somewhat experimental_.

### Centralized Identity

will be added

### Decentralized Identity

will be added

**Sign in with Ethereum**

**Self.id**

## On the way

These will be added: app characteristics, apis, sign in with Ethereum, continuous delivery, state management, CORS, cache
