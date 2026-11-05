---
title: "Peitho Studio: Let's make interactive HTML slides"
date: "2026-11-04"
description: "An introduction to Peitho Studio, interactive HTML slides, and using crit to connect a desktop app with a coding agent."
tags: ["peitho", "peitho-studio", "ai-agent"]
published: true
---

Some of you may be preparing slides for [YAPC::Tokyo 2026](https://yapcjapan.org/), so I'd like to introduce a slide tool.
I hope it makes you think, "I'd like to add an interactive demo" or "Maybe I should make my slides multilingual." 😀

<iframe class="article-media" src="/slides/peitho-studio/" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

I'm asking you to do something right from the first slide, but try the buttons in the upper right to switch between English and Japanese. The slides are HTML, so they can support multiple languages just like any web app. If you want our guest Larry Wall to be able to read your slides, that's a pretty good reason to add English!!

That sounds like a joke, but it does expand your potential audience. [Back in 2015, tagomoris wrote a post encouraging people to write slides about software technology in English](https://tagomoris.hatenablog.com/entry/2015/06/01/210425). With AI making translation easier, I think it's worth considering.

<iframe class="article-media" src="/slides/peitho-studio/?slide=2" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

I made these slides with [Peitho Studio](https://peitho-studio.piconic.ai/), an app I built around [Peitho](https://peitho.gosu.ke/), the slide tool created by [mizzy](https://x.com/gosukenator).

I'd love for you to try Peitho Studio, but the broader point I want to make is that **HTML slides are great!**

<iframe class="article-media" src="/slides/peitho-studio/?slide=3" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

The big difference from conventional slides is that **you can interact with HTML slides**. Switching languages is one example. On this slide, you can move the sliders on the left to change the particle animation. Demos often get left out of PDF slides, making them a treat only the people who attended get to enjoy. 😀

<iframe class="article-media" src="/slides/peitho-studio/?slide=4" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

Here's another example of an interactive HTML slide. When I teach math to my elementary-school-aged daughter, I sometimes make demos like this. They make a huge difference in how well things click for her. Slides already let us **communicate concise points one page at a time**, and this adds something more to that format.

<iframe class="article-media" src="/slides/peitho-studio/?slide=5" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

HTML slides have been around for a long time. The reason I'm bringing them up now is AI. AI is particularly good at HTML and tends to produce what I ask for.

The design lineage of Peitho Studio is shown in the slide above. k1LoW/deck established the separation of content and presentation. mizzy/Peitho made the presentation HTML-native and more friendly to AI. My rather straightforward idea was to make that easier to use. It may not be for everyone in the way Google Slides is, but I hope fellow engineers find it easy to work with.

<video class="article-media" src="https://peitho-studio.piconic.ai/studio-demo.mp4" controls playsinline preload="metadata" aria-label="Peitho Studio demo" style="width:100%;border-radius:8px">
  <a href="https://peitho-studio.piconic.ai/studio-demo.mp4">Watch the Peitho Studio demo</a>
</video>

This video shows me editing slides in Peitho Studio. I write the content in Markdown, leave a comment asking for the slides to look better, and a coding agent running in the background makes the changes. Explaining to AI exactly which element on which slide you want to change is tedious. Peitho Studio takes care of that part.

<iframe class="article-media" src="/slides/peitho-studio/?slide=7" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

I'd love for you to give Peitho Studio a try and make some HTML slides!

---

Now for a few notes on how Peitho Studio is built.

- It's a Tauri v2 desktop app.
- Peitho's rendering engine, peitho-core, is embedded directly in the app rather than run as a subprocess.
- The frontend uses [BarefootJS](https://barefootjs.dev/) for client-side rendering, along with UnoCSS.
- The editor is CodeMirror. It has Vim mode, too. Important!
- Releases are managed with [Songmu/tagpr](https://github.com/Songmu/tagpr).
- I use [moznion/cccc](https://github.com/moznion/cccc) to check Cognitive Complexity in CI and guide refactoring.
- The app bundles [crit](https://crit.md/) to work with coding agents.

I think the most interesting part was how I ended up using crit.

### How do you connect an app with a coding agent?

When I was designing a way for AI to edit slides, my first thought was to have the user provide an API key and make API calls from the app. But getting an API key is an extra step for the user, and I had security concerns, so I dropped that idea.

I wanted a way to work with a coding agent the user already uses, such as Claude Code or Codex, without handling an API key. That's when crit came to mind. crit connects agents and people through reviews of files. I think it originally became popular as a way to prompt agents through something resembling a GitHub pull request review.

Here's how it works in Peitho Studio.

![Peitho Studio and a Coding Agent exchange reviews through crit and work on the same local deck files.](crit-bridge.svg)

This means Studio doesn't need its own agent or API key. It starts by asking the user to paste a prompt into their agent, which then waits for the user's instructions. Studio provides the UI, and crit handles the connection.

I find this interesting because it's **a general approach to connecting local apps with coding agents**, not something limited to a slide tool.

---

That's it! I'm looking forward to YAPC!

Give it a try if it sounds useful!
