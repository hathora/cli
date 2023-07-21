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
  hathora-cloud login                     Login to Hathora Cloud    [aliases: l]
  hathora-cloud apps [subcommand]         Manage or create apps
  hathora-cloud deploy                    create a deployment for an app
  hathora-cloud logs                      view logs for an app/deployment/proces
                                          s
  hathora-cloud processes [subcommand]    Manage a specific process
  hathora-cloud deployments [subcommand]  Manage or create deployments
  hathora-cloud builds [subcommand]       Manage or create builds
  hathora-cloud room [subcommand]         manage or create rooms

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```