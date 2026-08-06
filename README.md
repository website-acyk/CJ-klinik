# CJ Klinik — Website & Staff System

Full clinic website (customer-facing) plus a private staff system, built as a static site with Cloudflare Pages Functions (serverless API) and a Cloudflare D1 database for persistence.

- Customer site: home, doctor profiles, doctor duty schedule, appointment booking. EN / Chinese / Bahasa Malaysia.
- Staff system: dashboard, staff guidelines, Google Sheets quick-links, duty timetable, doctor slot picker, notice publishing, appointment management. Protected by a shared passcode.

This README covers deploying what's already in this repo to Cloudflare Pages.

## 1. Prerequisites

- A free Cloudflare account: https://dash.cloudflare.com/sign-up
- Node.js installed locally (only needed if you want to test locally with npm run dev — not required just to deploy)

## 2. Create the D1 database

D1 is Cloudflare's database — it stores appointments, notices, doctor slots, sheet links, the guideline doc link, and the duty roster.

1. Go to the Cloudflare dashboard, Workers and Pages, D1, Create database.
2. Name it cj-klinik-db (any name works, but keep it consistent).
3. Once created, open it and go to the Console tab.
4. Open db/schema.sql from this repo, copy its entire contents, paste into the console, and run it. This creates all the tables and seeds the starting data (empty sheet links, default duty roster, etc.).
5. Copy the Database ID shown on the database's overview page — you'll need it in step 4 below.

## 3. Connect this GitHub repo to Cloudflare Pages

1. Cloudflare dashboard, Workers and Pages, Create application, Pages, Connect to Git.
2. Choose the CJ-klinik repository (under the styin-keiangela-chan-ui GitHub account).
3. Build settings — Framework preset: None. Build command: leave empty. Build output directory: / (this is a no-build static site).
4. Click Save and Deploy. The first deploy will succeed but the site won't work yet — it needs the D1 binding and the staff passcode secret (next steps).

## 4. Bind the D1 database to the Pages project

1. In the new Pages project, go to Settings, Functions, D1 database bindings.
2. Add a binding — Variable name: DB (must be exactly this, the code expects env.DB). D1 database: select cj-klinik-db.
3. Also update wrangler.toml in the repo — replace REPLACE_WITH_YOUR_D1_DATABASE_ID with the real Database ID from step 2 above, commit, and push. (This keeps local dev and any future wrangler CLI use in sync with the dashboard binding.)

## 5. Set the staff passcode secret

This is the shared password staff use to log into the private system.

1. Pages project, Settings, Environment variables.
2. Add a variable named STAFF_PASSCODE, mark it Secret (encrypted), and set it to whatever passcode you want staff to use.
3. Redeploy (Settings, Deployments, retry latest deploy, or just push any small change) so the new environment variable takes effect.

## 6. Redeploy

After steps 4 and 5, trigger a fresh deployment (Pages, Deployments, Retry deployment on the latest one, or push a commit). Once it finishes, the site is fully live — the customer pages, the staff login, and all API routes.

## 7. (Optional) Custom domain

Pages project, Custom domains, add your own domain (e.g. cjklinik.com) and follow Cloudflare's DNS instructions. Until then, Cloudflare gives you a free pages.dev URL automatically.

## Ongoing updates

Any future change: edit the code, commit, and git push to the main branch — Cloudflare Pages automatically rebuilds and redeploys within about a minute. No manual redeploy step needed after the first setup.

## What staff need to fill in after launch

A few things were intentionally left as placeholders since they depend on your own accounts:

- Guideline document: Staff, Guidelines page, paste the Google Doc link once it exists.
- Google Sheets links: Staff, Sheets page, paste the URLs for TPA, lab test, preorder, weight-loss form, and TPA price sheets.
- Duty roster names: Staff, Timetable page, edit each day's on-duty staff names.
- Doctor slots: Staff, Slots page, set each doctor's morning/afternoon availability per day, as needed.

## Local development (optional)

If you want to run this locally before pushing changes, install dependencies with npm install, apply the schema to a local D1 emulation with npm run db:migrate:local, then start the dev server with npm run dev.

Create a .dev.vars file (already gitignored) with STAFF_PASSCODE=yourtestpasscode for local staff login testing.# CJ Klinik — Website & Staff System

Full clinic website (customer-facing) plus a private staff system, built as a static site with Cloudflare Pages Functions (serverless API) and a Cloudflare D1 database for persistence.

- Customer site: home, doctor profiles, doctor duty schedule, appointment booking. EN / Chinese / Bahasa Malaysia.
- - Staff system: dashboard, staff guidelines, Google Sheets quick-links, duty timetable, doctor slot picker, notice publishing, appointment management. Protected by a shared passcode
- This README covers deploying what's already in this repo to Cloudflare Pages.
 
## 1. Prerequisites
- A free Cloudflare account: https://dash.cloudflare.com/sign-up
- Node.js installed locally (only needed if you want to test locally with npm run dev - not required just to deploy)
     
## 2. Create the D1 database
- D1 is Cloudflare's database - it stores appointments, notices, doctor slots, sheet links, the guideline doc link, and the duty roster.
     
1. Go to the Cloudflare dashboard, Workers and Pages, D1, Create database.
2. Name it cj-klinik-db (any name works, but keep it consistent).
3. Once created, open it and go to the Console tab.
4. Open db/schema.sql from this repo, copy its entire contents, paste into the console, and run it. This creates all the tables and seeds the starting data (empty sheet links, default duty roster, etc.).
5. Copy the Database ID shown on the database's overview page - you'll need it in step 4 below.

## 3. Connect this GitHub repo to Cloudflare Pages
                   
1. Cloudflare dashboard, Workers and Pages, Create application, Pages, Connect to Git.
2. Choose the CJ-klinik repository (under the styin-keiangela-chan-ui GitHub account).
3. Build settings:
 - Framework preset: None
 - Build command: (leave empty)
 - Build output directory: /  (this is a no-build static site)
4. Click Save and Deploy. The first deploy will succeed but the site won't work yet - it needs the D1 binding and the staff passcode secret (next steps).

## 4. Bind the D1 database to the Pages project
                                              
1. In the new Pages project, go to Settings, Functions, D1 database bindings.
2. Add a binding:
- Variable name: DB (must be exactly this - the code expects env.DB)
- D1 database: select cj-klinik-db
3. Also update wrangler.toml in the repo - replace REPLACE_WITH_YOUR_D1_DATABASE_ID with the real Database ID from step 2 above, commit, and push. (This keeps local dev and any future wrangler CLI use in sync with the dashboard binding.)
                                                                 
## 5. Set the staff passcode secret
This is the shared password staff use to log into the private system.
                                                                 
1. Pages project, Settings, Environment variables.
2. Add a variable named STAFF_PASSCODE, mark it Secret (encrypted), and set it to whatever passcode you want staff to use.
3. Redeploy (Settings, Deployments, retry latest deploy, or just push any small change) so the new environment variable takes effect.
                                                                          
## 6. Redeploy
                                                                          
After steps 4 and 5, trigger a fresh deployment (Pages, Deployments, Retry deployment on the latest one, or push a commit). Once it finishes, the site is fully live - the customer pages, the staff login, and all API routes.
                                                                          
## 7. (Optional) Custom domain
                                                                          
Pages project, Custom domains, add your own domain (e.g. cjklinik.com) and follow Cloudflare's DNS instructions. Until then, Cloudflare gives you a free pages.dev URL automatically.
                                                                          
## 8. Ongoing updates
Any future change: edit the code, commit, and git push to the main branch - Cloudflare Pages automatically rebuilds and redeploys within about a minute. No manual redeploy step needed after the first setup.
                                                                          
## 9. What staff need to fill in after launch
A few things were intentionally left as placeholders since they depend on your own accounts:
- Guideline document: Staff, Guidelines page, paste the Google Doc link once it exists.
- Google Sheets links: Staff, Sheets page, paste the URLs for TPA, lab test, preorder, weight-loss form, and TPA price sheets.
- Duty roster names: Staff, Timetable page, edit each day's on-duty staff names.
- Doctor slots: Staff, Slots page, set each doctor's morning/afternoon availability per day, as needed.
                                                                                    
## Local development (optional)
If you want to run this locally before pushing changes, install dependencies with npm install, apply the schema to a local D1 emulation with npm run db:migrate:local, then start the dev server with npm run dev.
                                                                                    
 - Create a .dev.vars file (already gitignored) with STAFF_PASSCODE=yourtestpasscode for local staff login testing.
