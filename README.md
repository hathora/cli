# hathora cli

## Overview

The hathora cli is a utility for interacting with the hathora api to create and manage hathora projects.

## Installation

Node v16+ required

```bash
npm i -g @hathora/cli
```

or with yarn

```bash
yarn global add @hathora/cli
```

## Usage

```bash
hathora-cloud [command] <options>
```

### CI Integration
You can integrate `hathora-cloud` into your CI pipeline by passing your [developer token](https://hathora.dev/docs/guides/generate-developer-token) like so:
```bash
hathora-cloud deploy --appId $APP_ID --token $HATHORA_TOKEN
```

Here's an [example Github Action](https://github.com/hathora/bullet-mania/blob/develop/.github/workflows/deploy.yml#L14).

## Commands

```
Usage: hathora-cloud <command> [options]

Commands:
  hathora-cloud completion                generate completion script
  hathora-cloud login                     Login to Hathora Cloud                                                                                                                                [aliases: l]
  hathora-cloud apps [subcommand]         Operations that allow you manage your applications
  hathora-cloud deploy                    Create a new build image and deploy it
  hathora-cloud logs                      Returns a stream of logs for an application
  hathora-cloud processes [subcommand]    View all processes
  hathora-cloud deployments [subcommand]  Create and view a build's deployment configurations at runtime
  hathora-cloud builds [subcommand]       Operations that allow you manage your builds
  hathora-cloud room [subcommand]         Operations to create, manage, and connect to rooms

Options:
  --version  Show version number                                                                                                                                                                   [boolean]
  --help     Show help                                                                                                                                                                             [boolean]
```
