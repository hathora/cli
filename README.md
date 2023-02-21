# hathora cli

## Overview

The hathora cli is a utility for interacting with the hathora api to create and manage hathora projects.

## Installation

```bash
npm i -g hathora
```

or with yarn

```bash
yarn global add hathora
```

## Usage

```bash
hathora [command] <options>
```

## Commands

```
Usage: hathora <command> [options]

Commands:
  hathora completion                generate completion script
  hathora login                     Login to Hathora Cloud          [aliases: l]
  hathora app create                Create a new app
  hathora deploy                    create a deployment for an app
  hathora logs                      view logs for an app/deployment/process
  hathora processes [subcommand]    Manage a specific process
  hathora deployments [subcommand]  Manage or create deployments
  hathora builds [subcommand]       Manage or create builds
  hathora room [subcommand]         manage or create rooms

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
