---
title: 'Configuration is code that nobody tests'
description: 'A gift card platform with 1,000+ brands, a 30-minute manual check per brand, and the validator that now checks all of them in about 30 minutes. Why config needs tests that run on a schedule, not on commit.'
date: 2026-10-09
tags: [backend, testing, systems]
---

Here is a bug that no test suite will ever catch. A shopper picks a gift card, chooses a denomination, pays, and the order fails. Nothing threw. Every test is green. The code did exactly what it was told. The problem is that somebody, weeks earlier, mapped that denomination to a product code the provider had since retired, and nobody noticed until a customer did.

We built a fix for this class of bug for a fintech client that runs more than 1,000 gift card brands. The SmokeTrees [case study](https://smoketrees.in/work/earnest-validation) has the short version. This is the longer one, because I think the lesson travels well beyond gift cards.

## Config behaves like code and gets treated like data

Every gift card brand on the platform carries its own setup. Which denominations it sells, which provider fulfils each one, the commission and margin on every sale, how the money settles afterwards, whether it is live at all. That record decides what happens in production just as much as any function in the codebase does. Change a margin and you change what the business earns on every order. Point a denomination at the wrong product code and orders fail.

But nobody reviews config the way they review code. It gets edited in an admin panel, by people whose job is onboarding brands, often in a hurry because a brand wants to go live this week. There is no compiler, no pull request, no CI run. The first test is a real customer.

Code goes through a compiler, a review, and CI before it reaches production. Config can break production just as thoroughly, and it usually goes through none of them.

## The checklist was already a test suite

The client did have a check. Before a brand went live, someone worked through a checklist by hand. Is the name filled in? Are there categories, keywords, terms and conditions? Does every denomination have a product code for its provider? It took about 30 minutes per brand. That sounds manageable until you multiply it. With more than 1,000 brands, and more arriving all the time, one full pass by hand would take over 500 hours. So each brand got its careful look once, before go-live, and misconfigured brands still slipped through.

That checklist was a test suite. It had assertions and a pass or fail result. It just ran on a person, and a tired person at the end of a long onboarding day is a flaky test runner.

So the first thing we did was the least clever. We took the checklist and turned it into code, one line at a time. The checklist itself sits in a comment above the checks, and each failure message reads like the line it came from. The people who wrote the checklist can read the report without anyone translating it for them.

Stripped down, a check is a function that looks at a brand and returns either nothing or a reason:

```ts
type Check = (brand: Brand) => string | null

const checks: Check[] = [
  (b) => (b.name ? null : 'Brand name is blank'),
  (b) => (b.categories.length > 0 ? null : 'Category is blank'),
  (b) =>
    b.customDenominations && (b.min == null || b.max == null)
      ? 'Custom denominations need a min and a max'
      : null,
]

const reasons = checks
  .map((check) => check(brand))
  .filter((r): r is string => r !== null)
```

Nothing in there is hard. The hard part was deciding that the checklist deserved to be code at all.

## Two kinds of wrong

Once we started writing checks, they split cleanly into two groups, and keeping them apart shaped the whole design.

The first group is a record that disagrees with itself. A required field is blank. A brand allows custom amounts but has no minimum or maximum. These checks are pure functions over one record. They need no network, they run in milliseconds, and you could run them the moment someone presses save.

The second group is a record that disagrees with the world. The config says a denomination is fulfilled by a provider under a certain product code. Is that still true? Only the provider knows. A brand can route through different providers depending on where it is sold, so one brand might mean asking two or three providers about every denomination it offers. These checks are slow, they depend on someone else's uptime, and they have to be polite. Our job spaces its calls out so a full run doesn't look like an attack on a partner's API.

If you mix the two groups, the fast checks inherit the slowness and flakiness of the slow ones. Keep them separate and each can run on the schedule that suits it.

## Two booleans, four states

One finding is worth its own section, because it is easy to create by accident and it may well be in your schema too.

Several yes-or-no settings were stored as two separate flags. One flag for "this brand allows it" and another for "this brand does not". Two booleans give you four states. Yes, no, both, and neither. Only two of those mean anything. "Neither" was common, because it is what you get when nobody touched the setting, and the rest of the system had to guess what it meant.

The right fix is a single field with explicit values, or a nullable one where null means "not decided yet" and blocks go-live. When the schema belongs to another system and you can't change it this quarter, the validator is where you enforce the rule instead. "Exactly one of these has to be true" became a check like any other.

Look at your own settings tables for pairs like this. They tend to hide in config, where nobody runs a type checker.

## Config rots while nobody touches it

The most important property of the validator was not what it checked. It was when it ran.

Code only changes when somebody commits, so running tests on every commit covers it. Config is different. A brand that passed every check on Monday can be broken by Thursday without anyone on our side changing a thing. The provider retires a product code. A denomination goes out of stock upstream. The record in our database is byte-for-byte what it was, and it is now wrong.

So the validator runs every day, against every live brand, whether or not anything changed on our side. Doing that by hand would mean 500 hours of checking every day, which is why nobody ever did. That is closer to a health check than to a unit test, and I think that is the right mental model for config that points at someone else's system. Validating it once at the point of entry gives you a clean result on day one. You need checks that run on a schedule and assume the outside world moved overnight.

## The output is a to-do list

What the validator produces mattered almost as much as what it checks.

Each run rebuilds the report from scratch. Every row is one brand, the reasons it failed in plain language, and a checkbox someone can tick once they have handled it. Brands that pass don't appear at all. Because the report is rebuilt every time, a fixed brand drops off the next run and a newly broken one appears, so the list always describes today.

That is the same principle we followed in our [reconciliation work](/work/reconciliation). Matching is easy. The useful part is handing people only the rows that need them, with the reason attached, so they start from the problem and not from a spreadsheet of everything.

## What changed

A manual check took about 30 minutes for one brand. The validator checks more than 1,000 brands in about 30 minutes. Failed gift card orders dropped sharply, the validator stopped commission miscalculations, and new brands could go live without the manual pass.

The time saved is the number people remember, but the daily run is what I would keep if I had to pick one thing. A manual checklist, however careful, only ever tells you a brand was right on the day someone checked it.

## If you have an admin panel, you have untested code

None of this was specific to gift cards. If your product has an admin panel that changes behaviour in production, there is code in your system that skips every check your real code goes through. Here is where I would start.

1. Find the checklist someone runs before something goes live. There is almost always one, in a doc or in someone's head.
2. Turn each line into a check that returns a reason in the checklist's own words.
3. Split the checks that only read the record from the ones that have to ask another system.
4. Run the second group on a schedule, not just on save, because the outside world changes without telling you.
5. Report failures as a short list that people can clear, not as a log nobody reads.

Your code already has a test suite. Give the config one too, and run it every day.
