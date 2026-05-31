---
slug: omarchy
title: "Omarchy OS Review: Two Months In and story "
excerpt: "A story of how I ended up using Omarchy OS and a short review of using it as a daily driver for two months from a common user (not so technical) perspective."
date: 2026-05-30
minutes: 5
tags: [Linux, Omarchy]
---

My introduction to Linux was in college as part of an "Operating System" course, where we learned to use Ubuntu and the command line interface. Fun course. But back then I never really understood the naming. Isn't Windows also an operating system? Why specifically learn only Linux in a class called "Operating System"?

Growing into a data engineer made the answer obvious. Most infrastructure runs on Linux: Docker containers, Kubernetes clusters, cloud VMs, data platforms, backend services. Matching your laptop to production cuts the translation layer. Commands work the same, scripts run without (crazy) modifications. Windows added WSL, which helps, but WSL is Linux running inside Windows. Not the same. Most Indonesian companies still hand out Windows laptops as standard enterprise hardware, and I've never understood that call. Windows is shit, sorry not sorry, Bill.

My Toshiba Satellite L645 (I named it Toshiba-san) got me into Linux as a daily driver during college. Seven or eight year-old machine, Windows 11 installed, speed of a snail, fan screaming. Then I found [*Elementary OS*](https://elementary.io/), lighter and prettier, and put it on. Not trying to look like a geek CS student (though I felt like one 😎). Just surviving on that old hardware. About a year and a half later, Toshiba-san wouldn't turn on one day without warning. No recovery, no goodbye, just nothing. I made my comeback to Windows on my girlfriend's (current: wife, shout out [*Intan*](https://intanwc.vercel.app)!) borrowed laptop. RIP *Toshiba-san*. Arigatou gozaimasu.

Since I received my offer letter from my current company in November last year, I started planning a Linux return. My new teammates all ran Linux, so the direction was clear. One project kept appearing in every review I watched on YouTube: [*Omakub*](https://omakub.org), [*DHH*](https://dhh.dk)'s Ubuntu-based setup that turns a fresh install into a working development environment. Sensible defaults, curated tooling, minimal configuration. Ubuntu familiarity sealed it.

But then the procurement at my company moved at procurement speed. I joined in January. The laptop arrived mid-March. Two and a half months of extra research time, which I used. Somewhere in the Omakub docs I found [*Omarchy*](https://omarchy.org), same philosophy, same creator, but built on Arch Linux instead of Ubuntu. That caught my attention. Arch gives you a rolling release and more flexibility, and my office network blocks `apt`, which would've stopped software updates on Ubuntu anyway. Omarchy solved both. I changed my mind on Omakub; figured I could handle Arch. The laptop arrived. Omarchy went on first.

## What Is Omarchy?

Omarchy is an Arch Linux-based setup created by DHH (David Heinemeier Hansson), the creator of Ruby on Rails. Install it on a new machine. You're coding before a fresh Windows setup wizard finishes.

## What Works Well

### Keyboard-First Workflow

The biggest win is the keyboard-driven interface. Omarchy keeps your hands off the mouse as much as possible.

My new office laptop is a Lenovo ThinkPad E14, and the keyboard on it is genuinely fun to type on. The trackpad, less so. I use a MacBook as my personal daily driver, and nobody makes a trackpad like Apple. Nobody. So a workflow that keeps me on the keyboard and off the trackpad is a feature, not a compromise.

Expect adjustment. Traditional window controls, maximize and minimize, don't behave like Windows or macOS trained you to expect. You think in keyboard shortcuts, workspaces, and window layouts instead. Once the muscle memory builds, it's fast. And if you blank on a shortcut, `Windows+K` pulls up the full list right there.

![Windows+K keybindings overlay](/images/omarchy/keybindings.jpeg)

### Window Management

Split-screen workflows come built in. Multiple workspaces work like macOS Desktops but feel more deliberate. Windows organize themselves instead of piling up on one screen, so you keep coding, docs, terminals, and Slack separate without thinking about it.

External monitors get their own workspace too. Plug one in with two workspaces open and the monitor picks up workspace 3. Each screen stays independent, which makes the dual-monitor setup feel intentional rather than just mirrored.

For development work, this is the most noticeable daily improvement.

![YouTube, VS Code, and a terminal update running across workspaces](/images/omarchy/workspaces.jpeg)

### Community Themes

Far more community themes exist than I expected. Customizing the desktop look takes minutes, not hours digging through config files.

![Community themes gallery at omarchythemes.com](/images/omarchy/themes-gallery.jpeg)

![Themes filtered by stars](/images/omarchy/themes-filtered.jpeg)

### Hardware That Just Worked

Fingerprint authentication worked on the first try. I'd found my colegue having a problem with fingerprint authentication on  Ubuntu Linux, even we using the same laptop model Lenovo E14. Seeing it work out of the box was a relief.

System monitoring comes built into the desktop too. CPU usage, memory, running processes, one dashboard. Small detail, but it makes the system feel complete. Shout out to BTOP++ for this masterpiece.

![Built-in system monitor showing CPU, memory, network, and processes](/images/omarchy/system-monitor.jpeg)

## Where It Falls Short

### Wired Headphones

Omarchy doesn't pick up my wired headphones. Bluetooth works fine. Still troubleshooting.

### Software Compatibility

Using a less mainstream system has a cost. Some software isn't designed for this environment. DBeaver's update notifications are unreliable everywhere; on Omarchy they're worse. YouTube picture-in-picture gets cropped.

![YouTube PiP cropped on Omarchy](/images/omarchy/youtube-pip.jpeg)

## So, Is It Worth Switching?

Wired headphones don't work, YouTube PiP gets cropped.

I open the ThinkPad, fingerprint unlocks it, and I'm in a workspace where my terminal, editor, and browser each have their own screen. No mouse. No stacked windows. External monitor picks up workspace 3 automatically. `Windows+K` is there when memory fails.

There's no fancy dock like macOS has. Omarchy isn't trying to be macOS. It's trying to be a enough OS for developers.

For a data engineer who deploys to Linux anyway, the environment fits. Omarchy removes the weekend you'd spend configuring Arch from scratch. I was coding the same day I installed it.

The headphones are annoying, but I'd choose it again.
