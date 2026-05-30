---
slug: omarchy
title: "Omarchy, Two Months In"
excerpt: "Two months on Omarchy as a daily development driver, from a data engineer / ordinary user perspective."
date: 2026-05-30
minutes: 5
tags: [Linux, Omarchy]
---

My first college introduction to Linux was a course called "Operating System," Ubuntu and command line from day one. Fun course. I never understood the name though. Isn't Windows also an operating system? Why specifically learn only Linux in a class called "Operating System"?

Growing into a data engineer made the answer obvious. Most infrastructure runs on Linux: Docker containers, Kubernetes clusters, cloud VMs, data platforms, backend services. Matching your laptop to production cuts the translation layer. Commands work the same, scripts run without modification, and debugging stops being a cross-OS archaeology project. Windows added WSL, which helps, but WSL is Linux running inside Windows. Not the same. Indonesian companies still hand out Windows laptops as standard enterprise hardware, and I've never understood that call. Sorry not sorry, Bill.

My Toshiba Satellite L645 got me into Linux. Seven or eight year old machine, Windows 11 installed, fan screaming. I found Elementary OS, lighter and prettier, and put it on. Not to look like a geek CS student (though I felt like one, haha). To survive on that old hardware. About a year of Elementary OS later, the Toshiba stopped turning on one day without warning. No recovery, no goodbye, just nothing. I made my comeback to Windows on my girlfriend's (current: wife, shout out [*Intan*](https://intanwc.vercel.app)!) borrowed laptop. RIP *Toshiba-san*. Arigatou gozaimasu.

I submitted my one-month notice and started planning a Linux return. My new teammates all ran Linux, so the direction was clear. One project kept appearing in every review I read: [*Omakub*](https://omakub.org), DHH's Ubuntu-based setup that turns a fresh install into a working development environment. Sensible defaults, curated tooling, minimal configuration. Ubuntu familiarity sealed it.

Procurement moved at procurement speed. I joined in January. The laptop arrived mid-March. Two and a half months of extra research time, which I used. Somewhere in the Omakub docs I found [*Omarchy*](https://omarchy.org), same philosophy, same creator, but built on Arch Linux instead of Ubuntu. That caught my attention. Arch gives you a rolling release and more flexibility, and my office network blocks `apt`, which would've stopped software updates on Ubuntu anyway. Omarchy solved both. The laptop arrived. Omarchy went on first.

## What Is Omarchy?

Omarchy is an Arch Linux-based setup created by DHH (David Heinemeier Hansson), the creator of Ruby on Rails. Install it on a new machine. You're coding before a fresh Windows setup wizard finishes.

## What Works Well

### Keyboard-First Workflow

The biggest win is the keyboard-driven interface. Omarchy keeps your hands off the mouse as much as possible.

My new office laptop is a Lenovo ThinkPad E14, and the keyboard on it is genuinely fun to type on. The trackpad, less so. I use a MacBook as my personal daily driver, and nobody makes a trackpad like Apple. Nobody. So a workflow that keeps me on the keyboard and off the trackpad is a feature, not a compromise.

Expect adjustment. Traditional window controls, maximize and minimize, don't behave like Windows or macOS trained you to expect. You think in keyboard shortcuts, workspaces, and window layouts instead. Once the muscle memory builds, it's fast. And if you blank on a shortcut, `Ctrl+K` pulls up the full list right there.

### Window Management

Split-screen workflows come built in. Multiple workspaces work like macOS Desktops but feel more deliberate. Windows organize themselves instead of piling up on one screen, so you keep coding, docs, terminals, and Slack separate without thinking about it.

External monitors get their own workspace too. Plug one in with two workspaces open and the monitor picks up workspace 3. Each screen stays independent, which makes the dual-monitor setup feel intentional rather than just mirrored.

For development work, this is the most noticeable daily improvement.

### Community Themes

Far more community themes exist than I expected. Customizing the desktop look takes minutes, not hours digging through config files.

### Hardware That Just Worked

Fingerprint authentication worked on the first try. I'd fought with that on other Linux distributions before, so seeing it work was a relief.

System monitoring comes built into the desktop too. CPU usage, memory, running processes, one dashboard. Small detail, but it makes the system feel complete.

## Where It Falls Short

### Wired Headphones

Omarchy doesn't pick up my wired headphones. Bluetooth works fine. Still troubleshooting.

### Software Compatibility

Using a less mainstream system has a cost. Some software isn't designed for this environment. DBeaver's notification system is bad everywhere, but here it's worse. YouTube picture-in-picture gets cropped.

### Update Notifications

I updated all installed apps and the notification stayed visible. Minor annoyance. You wonder whether the update ran or the notification failed to clear.

## Is It Worth Switching?

The wired headphones don't work. DBeaver's notifications look worse. YouTube PiP gets cropped.

I open the ThinkPad, fingerprint unlocks it, and I'm in a workspace where my terminal, editor, and browser each have their own screen. No mouse. No stacked windows. External monitor picks up workspace 3 automatically. `Ctrl+K` is there when memory fails.

For a data engineer who deploys to Linux anyway, the environment fits. The complaints are about apps that didn't think Linux users existed, not about the OS.

Omarchy earns its place by removing the part where you spend a weekend configuring Arch. You get the flexibility and rolling release without the ritual. I was coding the same day I installed it.

The headphones are annoying. but I'd choose it again. 
