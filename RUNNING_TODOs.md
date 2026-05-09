# Running TODOs

Finger-wagging list of "you'll regret it eventually but it's fine for now" items.
None of these are blocking; they're load-bearing for *someone else's* app, not
this one. Defer freely. Add new items as the regret arrives.

## Deploy plumbing
- [ ] `apps.toml` build is `["npm run build"]`. If you ever add a new dep,
      the deploy will fail at runtime because `node_modules` is stale. Fix
      with `["npm ci", "npm run build"]` when that bites.
- [ ] `verify = []` in `apps.toml`. A 2-second `npx tsc --noEmit` would catch
      type regressions before the service restarts on broken code. Add it
      once a bad deploy actually breaks the site.
- [ ] No `/api/health` endpoint. The status controller checks `/`, which
      couples liveness to a successful `/api/questions` round-trip. Fine
      until "process up but data broken" actually happens.
- [ ] Node version is whatever `/usr/bin/npm` resolves to. A system Node
      upgrade could silently break Next 15.1.2 on next service restart.
      Pin via `engines` in `package.json` and/or an explicit Node path
      in the systemd unit if it ever bites.

## Data
- [ ] `data/external/obs_media_mammals_aves_only.csv` is 3.4 MB committed
      to git. If you ever re-scrape or grow the dataset, the repo bloats
      fast. Move to Git LFS, a release asset, or runtime download when it
      starts mattering.
- [ ] CSV cache (`cachedRecords` in `src/app/api/questions/route.ts`)
      never invalidates. Edit the CSV on the box → restart the service or
      it serves stale data forever.

## Sampling algorithm quirks
- [ ] Daily rotation is keyed on UTC `unixDays`, so the "animal of the day"
      flips at 00:00 UTC, not local midnight. Mostly fine; mention it if a
      friend complains about timezones.
- [ ] No-seed mode advances `unixMinutes mod N`. With ~20k rows this means
      multiple unseeded refreshes within the same minute return the same
      animal. The frontend always sends a seed so this is theoretical.
