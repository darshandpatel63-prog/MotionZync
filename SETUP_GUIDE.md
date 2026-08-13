# MotionZync — GitHub-based Animations: Setup Guide

Aa guide follow karo eka j vaar — pachi Admin panel thi save karો etle badhu automatic thashe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## શું બદલાયું — 1 લીટીમાં
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Animations have Firestore ni jagya e `public/animations/` folder ma GitHub par store thay chhe. Admin panel ma Save/Delete dabaવો etle server (`/api/admin-animations`) GitHub par ek commit kare chhe, Vercel આપોआप redeploy kare chhe. **View count feature દૂર કરી છે** — Firebase હવે ફક્ત admin login verify કરવા માટે વપરાય છે, બીજું કંઈ નહીં.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Step 1 — GitHub Fine-grained Personal Access Token
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GitHub par jaao → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   (સીધી લિંક: `github.com/settings/tokens?type=beta`)
2. **Generate new token**
3. **Token name**: `motionzync-admin`
4. **Expiration**: 90 days ke custom (jetlu vadhare rakho, etli var pachi renew karvu padshe)
5. **Repository access** → **Only select repositories** → tamaru MotionZync repo pasand karo
   ⚠️ **Important**: "All repositories" ક્યારેય select ना karvu — token ne FAKT aa 1 repo ni access hovi joie
6. **Permissions → Repository permissions → Contents** → **Read and write** karo (baki badhu "No access" j rakhવુ)
7. **Generate token** dabao, token copy kari lo (ek j var dekhાय chhe!)

## Step 2 — Firebase Service Account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Firebase Console](https://console.firebase.google.com) → tamaru project → ⚙️ **Project Settings**
2. **Service accounts** tab
3. **Generate new private key** → confirm → ek `.json` file download thashe
4. Aa file kholo, aa 3 values joie:
   - `project_id`
   - `client_email`
   - `private_key` (aakhi string, `-----BEGIN PRIVATE KEY-----` thi `-----END PRIVATE KEY-----` sudhi, `\n` sahit)

⚠️ Aa `.json` file GitHub par ક્યારેય upload ना karવી — file save kari rakho, pachi delete kari do.

## Step 3 — Vercel ma Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vercel Dashboard → tamaru project → **Settings → Environment Variables** → aa badha add karo (**Production** + **Preview** banne ma):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | Step 1 no token |
| `GITHUB_REPO_OWNER` | tamaru GitHub username |
| `GITHUB_REPO_NAME` | repo nu naam (e.g. `MotionZync`) |
| `GITHUB_REPO_BRANCH` | `main` |
| `FIREBASE_PROJECT_ID` | Step 2 nu `project_id` |
| `FIREBASE_CLIENT_EMAIL` | Step 2 nu `client_email` |
| `FIREBASE_PRIVATE_KEY` | Step 2 nu `private_key` (quotes sahit paste karo) |
| `ADMIN_EMAIL` | tamaru admin Gmail (jete `VITE_ADMIN_EMAIL` ma chhe e j) |

`.env.example` file ma pan aa badha name list chhe, reference mate.

## Step 4 — Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aa aakhi updated project GitHub repo ma push karo (juni files replace thashe)
2. Vercel આપોआप naવો build shરૂ karशे — **Deployments** tab ma check karo, "Ready" thai jaay etle badhu live
3. `npm install` pehli var Vercel par j automatic thashe (naવા packages: `firebase-admin`, `@vercel/functions`)

## Step 5 — Test karo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] `/gallery` khોલો — badha 175 animations dekhાय chhे ke?
- [ ] Admin panel ma login karo, ek animation edit kari save karo → ~30-60 sec pachi live site par refresh kari check karo
- [ ] Ek navi category banavo → save thai chhे ke?
- [ ] Ek animation delete karo → GitHub repo ma jai ne check karo ke file khરેખar delete thai
- [ ] `/animation/<koi-id>` page khોલો, browser ni "View Page Source" ma title check karo (client-side SEO)
- [ ] Bot check (terminal/mobile browser thi):
  ```
  curl -A "Googlebot" https://motion-zync.vercel.app/animation/<koi-docId>
  ```
  Response ma e animation nu પોતાનું `<title>` deખાવु joie.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Samajva jevi vaato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- **30-60 sec delay**: Save/Delete tarat GitHub par thai jaay chhe, pan LIVE site par dekhાવા Vercel na redeploy jetlો time (~30-60 sec) lage. Admin panel nu list tarat j update dekhાડे chhe (optimistic update), pan real visitors ne redeploy pachi j navu data malshe.
- **Category rename**: naam badલો to badhi animations ni file ma pan `category` field update thai jaay chhe (automatic). Folder naam ક્યારેય nathi badલાતુ (links tuti na jaay).
- **Category delete**: je category ma animations chhे te delete nai thai shake — pehla e animations move/delete karવા padshe. (Data safe rakhવા mate ā rite rakhયુ chhे.)
- **175 animations**: tamari zip mathi j automatic migrate thai gaya chhे (`scripts/migrate-animations.mjs` thi) — koi pan navu upload karવાni jaruriyat nathi.
- **View count**: aa feature entirely remove kari didhu chhe — koi pan page par views nathi dekhaadto, incrementView function pan nathi. Firestore no animations collection have kai j use nathi thato (delete karvu hoy to Firebase console mathi jaate kari shako, e optional chhe).
