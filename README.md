# hathora cli

## Overview

The hathora cli is a utility for interacting with the hathora api to create and manage hathora projects.

## Installation

```bash
npm i -g @hathora/cli
```

or with yarn

```bash
yarn global add @hathora/cli
```

## Usage

```bash
hathora [command] <options>
```

## Commands

```
Usage: hathora-cloud <command> [options]

Commands:
  hathora-cloud completion                generate completion script
  hathora-cloud login                     Login to Hathora Cloud          [aliases: l]
  hathora-cloud app create                Create a new app
  hathora-cloud deploy                    create a deployment for an app
  hathora-cloud logs                      view logs for an app/deployment/process
  hathora-cloud processes [subcommand]    Manage a specific process
  hathora-cloud deployments [subcommand]  Manage or create deployments
  hathora-cloud builds [subcommand]       Manage or create builds
  hathora-cloud room [subcommand]         manage or create rooms

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
