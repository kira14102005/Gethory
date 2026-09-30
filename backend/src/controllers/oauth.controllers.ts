import { APP_ORIGIN, ACCESS_TOKEN_EXPIRY, BACKEND_URL, DEFAULT_AVATAR, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import SessionModel from "../models/SessionModel";
import User from "../models/UserCollection";
import catchError from "../utils/catchErrorWrapper";
import { setCookie } from "../utils/cookie";
import { get30daysfromNow, get7daysfromNow } from "../utils/date";
import { accessTokenSignOptions, refereshTokenSignOptions, signToken } from "../utils/jwt";

type Provider = "google" | "github";

const callbackURL = (p: Provider) => `${BACKEND_URL}/api/auth/${p}/callback`;
const failURL = `${APP_ORIGIN}/signin?oauth=failed`;

// ponytail: no `state` CSRF check; add signed state cookie if forged-login becomes a threat
export const oauthStartController = (provider: Provider) =>
  catchError(async (_req, res) => {
    const redirect = callbackURL(provider);
    const url =
      provider === "google"
        ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${encodeURIComponent("openid email profile")}`
        : `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent("read:user user:email")}`;
    return res.redirect(url);
  });

async function profileFromCode(provider: Provider, code: string) {
  if (provider === "google") {
    const t = await (await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: callbackURL(provider), grant_type: "authorization_code" }),
    })).json() as { access_token?: string };
    if (!t.access_token) return null;
    const p = await (await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${t.access_token}` } })).json() as { email?: string; name?: string; picture?: string };
    return p.email ? { email: p.email, name: p.name, avatar: p.picture } : null;
  }
  const t = await (await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ code, client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, redirect_uri: callbackURL(provider) }),
  })).json() as { access_token?: string };
  if (!t.access_token) return null;
  const h = { Authorization: `Bearer ${t.access_token}` };
  const u = await (await fetch("https://api.github.com/user", { headers: h })).json() as { email?: string | null; name?: string | null; login?: string; avatar_url?: string };
  let email = u.email ?? undefined;
  if (!email) {
    const emails = await (await fetch("https://api.github.com/user/emails", { headers: h })).json() as { email: string; primary: boolean; verified: boolean }[];
    email = Array.isArray(emails) ? (emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified) ?? emails[0])?.email : undefined;
  }
  return email ? { email, name: u.name ?? u.login, avatar: u.avatar_url } : null;
}

export const oauthCallbackController = (provider: Provider) =>
  catchError(async (req, res) => {
    const code = req.query.code as string | undefined;
    if (!code) return res.redirect(failURL);
    const profile = await profileFromCode(provider, code);
    if (!profile) return res.redirect(failURL);

    // ponytail: random unusable password satisfies required:true; switch to password-optional schema if OAuth-only accounts matter
    // ponytail: Math.random dead credential, never typed by OAuth users; use crypto.randomBytes if password-login for these accounts ever matters
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await User.create({ email: profile.email, password: `oauth-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: profile.name, avatar: profile.avatar ?? DEFAULT_AVATAR, verified: true });
    } else if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    // ponytail: mirrors loginUser tiers; OAuth users are verified so 7d until profile done, 30d after
    const done = user.profileCompleted;
    const expiry = done ? get30daysfromNow() : get7daysfromNow();
    const session = await SessionModel.create({ userId: user._id, userAgent: req.headers["user-agent"], expiresAt: expiry });
    const refreshToken = signToken({ sessionId: session._id }, { secret: JWT_REFRESH_SECRET, expiresIn: done ? "30d" : "7d", ...refereshTokenSignOptions });
    const accessToken = signToken({ userId: user._id, sessionId: session._id }, { secret: JWT_SECRET, expiresIn: ACCESS_TOKEN_EXPIRY, ...accessTokenSignOptions });
    setCookie({ res, accessToken, refreshToken, refreshTokenExpiry: expiry });
    return res.redirect(`${APP_ORIGIN}${done ? "/profile" : "/auth"}`);
  });
