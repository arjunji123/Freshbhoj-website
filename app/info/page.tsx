"use client";

import { useEffect, useState } from "react";
import { Inter, Poppins } from "next/font/google";
import styles from "./info.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

type Theme = "light" | "dark";

export default function InfoPage() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("fb-info-theme");
    } catch {
      // ignore — private browsing / blocked storage
    }
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Reading localStorage/matchMedia only exists client-side, so this can't
    // be a useState lazy initializer without breaking SSR — an effect is the
    // standard way to pick up the real preference right after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved === "dark" || saved === "light" ? saved : prefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("fb-info-theme", next);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`${styles.pageRoot} ${inter.variable} ${poppins.variable}`}
      data-theme={theme}
    >
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.heroTop}>
            <span className={styles.wordmark}>FreshBhoj</span>
            <button className={styles.themeToggle} type="button" onClick={toggleTheme}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
          <h1>How FreshBhoj Works</h1>
          <p className={styles.lede}>
            A plain-language guide to everything FreshBhoj offers — for the people who order
            food, and the kitchens who cook it.
          </p>
          <div className={styles.pillRow}>
            <span className={styles.pill}>For Customers</span>
            <span className={styles.pill}>For Kitchen Partners</span>
            <span className={styles.pill}>The Business Model</span>
          </div>
        </div>
      </header>

      <nav className={styles.toc}>
        <div className={styles.wrap}>
          <a className={styles.tocLink} href="#intro">Overview</a>
          <a className={styles.tocLink} href="#part1">For Customers</a>
          <a className={styles.tocLink} href="#part2">For Kitchens</a>
          <a className={styles.tocLink} href="#part3">Business Model</a>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.wrap}>
          <section className={styles.introBlock} id="intro">
            <h2>What Is FreshBhoj?</h2>
            <p>
              FreshBhoj is a food-ordering app that connects two kinds of people:{" "}
              <strong>customers</strong> who want fresh, home-style food delivered to them, and{" "}
              <strong>kitchen partners</strong> — home cooks, cloud kitchens, tiffin services and
              restaurants alike — who want an easy way to sell their food to far more people than
              they could reach on their own.
            </p>
            <p>
              Think of it like this: a talented home cook who makes great food for 10 regular
              customers a month, purely by word of mouth, now gets a real shop-front — an app
              where hundreds of nearby customers can discover their food, order it, pay for it,
              and come back for more, without the cook ever having to build a website, hire a
              delivery team, or figure out digital marketing.
            </p>
            <p>FreshBhoj exists as three connected pieces:</p>
            <ul>
              <li>
                <strong>The Customer App</strong> — where people browse kitchens, order food,
                subscribe to meal plans and manage their account.
              </li>
              <li>
                <strong>The Kitchen Partner App</strong> — where a kitchen owner runs their
                day-to-day business: orders, menu, marketing, earnings.
              </li>
              <li>
                <strong>The Kitchen Partner Website</strong> — the same kitchen-management tools,
                for an owner who prefers working from a laptop.
              </li>
            </ul>
          </section>

          {/* PART 1 */}
          <section className={styles.partHeader} id="part1">
            <span className={styles.partTag}>Part 1</span>
            <h2>For Customers</h2>
            <p className={styles.partSub}>
              Opening the FreshBhoj app, a customer sees kitchens and dishes near them, can order
              a single meal like any food-delivery app, or set up a recurring meal plan and mostly
              forget about ordering every day after that.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Discovering Food &amp; Kitchens</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <b>Nearby kitchens &amp; dishes</b>
                <span>The app shows kitchens and meals close to the customer&apos;s location first, since a home-style kitchen typically only delivers within a few kilometres.</span>
              </div>
              <div className={styles.card}>
                <b>Trending Near You</b>
                <span>A ranked list of what&apos;s actually popular nearby right now, based on real order counts and ratings — not paid placement.</span>
              </div>
              <div className={styles.card}>
                <b>Search &amp; filters</b>
                <span>Search by dish or kitchen, filter by cuisine, diet (veg/non-veg/vegan/egg), and health goals like &quot;High Protein&quot; or &quot;Low Calorie&quot;.</span>
              </div>
              <div className={styles.card}>
                <b>Reels &amp; Stories</b>
                <span>Kitchens post short videos of their food (like Instagram Reels). Watch a Reel, order the exact dish shown in it, directly.</span>
              </div>
              <div className={styles.card}>
                <b>Following kitchens</b>
                <span>Once a customer finds a kitchen they like, they can follow it to keep track of it and find it more easily next time.</span>
              </div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Ordering &amp; Tracking</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <b>Placing an order</b>
                <span>Add dishes to a cart from any open kitchen, choose a payment method, and place the order.</span>
              </div>
              <div className={styles.card}>
                <b>Payment options</b>
                <span>UPI, debit/credit card, the FreshBhoj Wallet, or Cash on Delivery.</span>
              </div>
              <div className={styles.card}>
                <b>Order status, start to finish</b>
                <span>Placed → Accepted → Preparing → Out for Delivery → Delivered (or Cancelled) — always honest, always visible.</span>
              </div>
              <div className={styles.card}>
                <b>Order Chat</b>
                <span>A live chat attached to that one order, directly with the kitchen — ask a question, get a real answer.</span>
              </div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Meal Subscriptions — for when daily ordering gets tiring</h3>
            <p className={styles.sectionIntro}>
              For someone who eats from the same kitchen regularly, FreshBhoj offers a real
              subscription system, not a one-off order repeated manually.
            </p>
            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  <tr><th></th><th>Kitchen&apos;s Own Plan</th><th>Build-Your-Own Plan</th></tr>
                  <tr><td>Who sets it up</td><td>The kitchen designs &amp; prices it in advance</td><td>The customer builds it themselves</td></tr>
                  <tr><td>Price</td><td>Fixed by the kitchen</td><td>Calculated live from choices made</td></tr>
                  <tr><td>Flexibility</td><td>Pick from what&apos;s offered</td><td>Diet, quantity, days, time, start date — all free choice</td></tr>
                  <tr><td>Best for</td><td>A ready-made package</td><td>Specific needs a plan doesn&apos;t cover</td></tr>
                </tbody>
              </table>
            </div>
            <p className={styles.sectionIntro}>
              Once a kitchen accepts the request, the customer gets a delivery calendar, one-tap
              Swap Tomorrow&apos;s Meal, Pause &amp; Resume any time, and Vacation Mode — pausing
              every active subscription at once before travelling.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Wallet, Payments &amp; Rewards</h3>
            <div className={styles.cardGrid}>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}>
                <b>FreshBhoj Wallet</b>
                <span>Add money once, pay instantly for orders and subscriptions. Withdraw it back out any time.</span>
              </div>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}>
                <b>Saved payment methods</b>
                <span>Cards and UPI IDs saved for faster checkout next time.</span>
              </div>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}>
                <b>Refer &amp; Earn (FreshBhoj Coins)</b>
                <span>Invite a friend: they get 50 coins, you get 100. 1 coin = ₹1, usable on any order ₹1,000+, up to ₹200 off.</span>
              </div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Nutrition Transparency, Trust &amp; Verified Kitchens</h3>
            <p className={styles.sectionIntro}>
              FreshBhoj is built around one idea a lot of food apps skip: honest information about
              what you&apos;re eating and who&apos;s cooking it.
            </p>
            <div className={styles.cardGrid}>
              <div className={styles.card}>
                <b>Real nutrition data on every dish</b>
                <span>Calories, protein, carbs and fat, shown with a visual ring — not a vague &quot;healthy&quot; label.</span>
              </div>
              <div className={styles.card}>
                <b>Veg / Non-Veg / Vegan / Egg indicator</b>
                <span>The familiar coloured-dot system, on every dish, so there&apos;s never a guessing game.</span>
              </div>
              <div className={styles.card}>
                <b>Jain-friendly options</b>
                <span>Dishes made without onion, garlic or root vegetables are clearly marked.</span>
              </div>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}>
                <b>Verified Kitchen badge</b>
                <span>
                  More than passing the standard sign-up review — a kitchen can request an
                  on-site visit, where FreshBhoj&apos;s own team physically checks things like
                  hygiene in person. Only a kitchen that passes this gets the badge.
                  FSSAI-licensed kitchens get preference for the visit. Not having the badge isn&apos;t
                  necessarily unsafe — it just hasn&apos;t been physically cross-checked yet, so a
                  customer can see exactly how much independent checking stands behind each
                  kitchen.
                </span>
              </div>
              <div className={styles.card}>
                <b>Ratings &amp; reviews</b>
                <span>Real feedback from customers who&apos;ve actually ordered.</span>
              </div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Everything Else for Customers</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}><b>Order history</b><span>Every past order, one tap to reorder.</span></div>
              <div className={styles.card}><b>Favourites</b><span>Save dishes and kitchens to come back to quickly.</span></div>
              <div className={styles.card}><b>Notifications</b><span>Real-time updates on order status and account activity.</span></div>
              <div className={styles.card}><b>Help &amp; Support</b><span>WhatsApp support or FAQs, directly in-app.</span></div>
              <div className={styles.card}><b>Profile &amp; Addresses</b><span>Manage saved delivery addresses and account details.</span></div>
              <div className={styles.card}><b>Dark mode</b><span>A full dark theme across the app, for anyone who prefers it.</span></div>
            </div>
          </section>

          {/* PART 2 */}
          <section className={styles.partHeader} id="part2">
            <span className={styles.partTag}>Part 2</span>
            <h2>For Kitchen Partners</h2>
            <p className={styles.partSub}>
              For a home cook or a small kitchen, being good at cooking has never automatically
              meant being good at running a business. FreshBhoj is built to remove that second
              job.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Getting Started — Registration to Going Live</h3>
            <p className={styles.sectionIntro}>
              Becoming a kitchen partner starts with a phone number and an OTP — no password, no
              paperwork upfront.
            </p>

            <div className={styles.diagramWrap}>
              <svg viewBox="0 0 800 310" role="img" aria-label="Every kitchen is checked before going live">
                <defs>
                  <marker id="onb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" fill="var(--neutral-400)" />
                  </marker>
                </defs>
                <text x="24" y="28" fontSize="15" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-poppins), sans-serif">Every kitchen is checked before going live</text>
                <g fill="none" stroke="var(--neutral-400)" strokeWidth="1.25">
                  <path d="M250,116H320" markerEnd="url(#onb-arrow)" />
                  <path d="M540,116H596" markerEnd="url(#onb-arrow)" />
                  <path d="M660,156V226" markerEnd="url(#onb-arrow)" />
                  <path d="M596,116H430V226" markerEnd="url(#onb-arrow)" />
                  <path d="M335,250H140V144" markerEnd="url(#onb-arrow)" />
                </g>
                <g>
                  <rect x="30" y="88" width="220" height="56" rx="8" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="140" y="112" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">Sign Up &amp; Setup</text>
                  <text x="140" y="128" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">Phone OTP + kitchen details</text>
                </g>
                <g>
                  <rect x="320" y="88" width="220" height="56" rx="8" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="430" y="112" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">Docs, Bank &amp; Menu</text>
                  <text x="430" y="128" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">FSSAI, photos, bank, 1+ dish</text>
                </g>
                <g>
                  <polygon points="596,116 660,76 724,116 660,156" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="660" y="120" textAnchor="middle" fontSize="13" fill="var(--text-primary)">Approved?</text>
                </g>
                <g>
                  <rect x="565" y="226" width="190" height="48" rx="8" fill="var(--wash-primary)" stroke="var(--primary-600)" strokeWidth="2" />
                  <text x="660" y="254" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">Kitchen Goes Live!</text>
                </g>
                <g>
                  <rect x="335" y="226" width="190" height="48" rx="8" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="430" y="254" textAnchor="middle" fontSize="13" fill="var(--text-primary)">Sent Back to Fix</text>
                </g>
                <text x="672" y="194" fontSize="11.5" fill="var(--text-secondary)">yes</text>
                <text x="442" y="172" fontSize="11.5" fill="var(--text-secondary)">no</text>
                <text x="237" y="266" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">fix &amp; resubmit</text>
              </svg>
              <p className={styles.diagramCaption}>onboarding flow · sign-up to approved &amp; live</p>
            </div>

            <p className={styles.sectionIntro}>
              From sign-up, an owner fills in kitchen and location details, uploads the required
              documents (FSSAI food-safety licence, two kitchen photos, bank details), and adds at
              least one dish before submitting for review. FreshBhoj&apos;s team checks everything
              before a kitchen ever appears to a customer.
            </p>
            <div className={styles.callout}>
              <b>Don&apos;t have an FSSAI licence?</b> FreshBhoj can file it on the owner&apos;s
              behalf for a flat ₹500 service fee, on top of the ₹1,000 government fee (passed
              through unchanged).
            </div>
            <div className={styles.callout}>
              <b>Want the Verified badge?</b> Going live only needs the review above — but any
              kitchen can separately request an on-site visit at any time after that, where
              FreshBhoj&apos;s own team checks things like hygiene in person. Passing that visit
              is what earns the Verified badge customers see on the app. FSSAI-licensed kitchens
              get preference for scheduling one.
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Running the Kitchen, Day to Day</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}><b>Incoming orders</b><span>A live queue — accept, mark Preparing, Out for Delivery, then Delivered.</span></div>
              <div className={styles.card}><b>Order Chat</b><span>Talk directly to a customer about their specific order.</span></div>
              <div className={styles.card}><b>Pause new orders</b><span>Stop taking orders temporarily without going fully offline or editing the whole menu.</span></div>
              <div className={styles.card}><b>Operating hours &amp; holidays</b><span>A normal weekly schedule (even lunch + dinner sessions), plus specific closed dates set in advance.</span></div>
              <div className={styles.card}><b>Menu management</b><span>Add, edit or remove dishes any time; mark unavailable without deleting; set nutrition &amp; Jain-availability per dish.</span></div>
              <div className={styles.card}><b>Daily dashboard</b><span>Today&apos;s orders &amp; revenue at a glance, plus a 7-day revenue trend.</span></div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Growing the Business — Marketing Tools Built In</h3>
            <div className={styles.cardGrid}>
              <div className={styles.card}><b>Reels</b><span>Short food videos posted from the app, shown to nearby customers — link one to a dish so a viewer can order it immediately.</span></div>
              <div className={styles.card}><b>Stories</b><span>Quick, short-lived updates like &quot;today&apos;s special&quot; — the same idea as Instagram/WhatsApp Stories.</span></div>
              <div className={styles.card}><b>Boost / Ads</b><span>Pay a daily budget to get a Reel shown to more people. The total is set aside upfront — no surprise bill. Roughly ₹1/day ≈ 8 extra people reached.</span></div>
              <div className={styles.card}><b>BhojAI Suggestions</b><span>Once a day, an AI assistant reviews ad performance and suggests concrete next steps — apply with one tap, or ignore.</span></div>
            </div>
          </section>

          <section className={styles.feature}>
            <h3>Kitchen-Authored Subscription Plans</h3>
            <p className={styles.sectionIntro}>
              Beyond one-off orders, an established kitchen can design and price its own named
              subscription plan — a &quot;Weekly Diet Thali&quot; at a price the kitchen sets,
              covering the diets and meal times it wants to offer. Every subscription request —
              kitchen-authored or custom — still goes through the same kitchen-approval step, so a
              kitchen never ends up with a subscriber it didn&apos;t agree to serve.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Premium Plans — Optional Upgrades for Kitchens</h3>
            <p className={styles.sectionIntro}>
              Separate from anything a customer sees, FreshBhoj also sells its own paid tiers
              directly to kitchen partners who want extra visibility and tools.
            </p>
            <div className={styles.callout}>
              <b>Not finalized yet.</b> The tiers and prices below are early planning numbers,
              still being worked out.
            </div>
            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  <tr><th></th><th>Basic — ₹499</th><th>Pro — ₹1,299</th><th>Elite — ₹2,499</th></tr>
                  <tr><td>Billing period</td><td className={styles.center}>28 days</td><td className={styles.center}>28 days</td><td className={styles.center}>28 days</td></tr>
                  <tr><td>Reels per period</td><td className={styles.center}>Up to 2</td><td className={styles.center}>Unlimited</td><td className={styles.center}>Unlimited</td></tr>
                  <tr><td>Advanced analytics</td><td className={styles.center}>—</td><td className={styles.center}>✓</td><td className={styles.center}>✓</td></tr>
                  <tr><td>AI menu insights</td><td className={styles.center}>—</td><td className={styles.center}>✓</td><td className={styles.center}>✓</td></tr>
                  <tr><td>Priority support</td><td className={styles.center}>—</td><td className={styles.center}>✓</td><td className={styles.center}>✓</td></tr>
                  <tr><td>Verified-badge upgrade</td><td className={styles.center}>—</td><td className={styles.center}>✓</td><td className={styles.center}>✓</td></tr>
                  <tr><td>Priority placement boost</td><td className={styles.center}>Standard</td><td className={styles.center}>Standard</td><td className={styles.center}>3x</td></tr>
                  <tr><td>AI-assisted video editing</td><td className={styles.center}>—</td><td className={styles.center}>—</td><td className={styles.center}>✓</td></tr>
                  <tr><td>Sponsored profile</td><td className={styles.center}>—</td><td className={styles.center}>—</td><td className={styles.center}>✓</td></tr>
                  <tr><td>Dedicated growth manager</td><td className={styles.center}>—</td><td className={styles.center}>—</td><td className={styles.center}>✓</td></tr>
                </tbody>
              </table>
            </div>
            <p className={styles.sectionIntro}>
              Entirely optional: a kitchen that never buys a Premium plan is completely
              unrestricted in the core ability to sell food, take orders and get paid.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Getting Paid — Kitchen Wallet &amp; Payouts</h3>
            <div className={styles.cardGrid}>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}><b>Earnings at a glance</b><span>Today&apos;s earnings and all-time totals, visible any time.</span></div>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}><b>Request a payout</b><span>Withdraw the available balance to the registered bank account (shown only masked, for security).</span></div>
              <div className={`${styles.card} ${styles.cardAccentGreen}`}><b>One merged transaction history</b><span>Money in from orders and money out for ads/Premium, in a single, honest list.</span></div>
            </div>
          </section>

          {/* PART 3 */}
          <section className={styles.partHeader} id="part3">
            <span className={styles.partTag}>Part 3</span>
            <h2>The Business Model — How Everyone Makes Money</h2>
          </section>

          <section className={styles.feature}>
            <h3>How the Money Actually Moves</h3>
            <div className={styles.callout}>
              <b>Not finalized yet.</b> The exact revenue split below is still being researched —
              FreshBhoj&apos;s own delivery-fee model isn&apos;t integrated yet, and
              delivery/service fees will factor into the final numbers. The one thing already
              decided: whatever the final split is, a kitchen partner should earn <i>at least</i>{" "}
              as much through FreshBhoj as they would selling the same food offline, on their own.
            </div>

            <div className={styles.diagramWrap}>
              <svg viewBox="0 0 740 300" role="img" aria-label="Kitchen keeps the majority of every order">
                <defs>
                  <marker id="mon-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" fill="var(--neutral-400)" />
                  </marker>
                </defs>
                <text x="24" y="28" fontSize="15" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-poppins), sans-serif">Kitchen keeps the majority of every order</text>
                <g fill="none" stroke="var(--neutral-400)" strokeWidth="1.25">
                  <path d="M190,140H320V68H480" markerEnd="url(#mon-arrow)" />
                  <path d="M190,168H320V238H480" markerEnd="url(#mon-arrow)" />
                  <path d="M580,96V210" markerEnd="url(#mon-arrow)" />
                </g>
                <g>
                  <rect x="20" y="130" width="170" height="48" rx="8" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="105" y="150" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">Customer</text>
                  <text x="105" y="166" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">pays for the order</text>
                </g>
                <g>
                  <rect x="480" y="40" width="200" height="56" rx="8" fill="var(--wash-primary)" stroke="var(--primary-600)" strokeWidth="2" />
                  <text x="580" y="64" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">Kitchen</text>
                  <text x="580" y="80" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">keeps most of it</text>
                </g>
                <g>
                  <rect x="480" y="210" width="200" height="56" rx="8" fill="none" stroke="var(--border-default)" strokeWidth="1.25" />
                  <text x="580" y="234" textAnchor="middle" fontWeight="700" fontSize="13" fill="var(--text-primary)">FreshBhoj</text>
                  <text x="580" y="250" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">keeps a commission</text>
                </g>
                <text x="330" y="100" fontSize="11.5" fill="var(--text-secondary)">majority → kitchen</text>
                <text x="330" y="206" fontSize="11.5" fill="var(--text-secondary)">commission → FreshBhoj</text>
                <text x="592" y="150" fontSize="11.5" fill="var(--text-secondary)">+ ads, Premium,</text>
                <text x="592" y="164" fontSize="11.5" fill="var(--text-secondary)">FSSAI fee (optional)</text>
              </svg>
              <p className={styles.diagramCaption}>order payment split · customer to kitchen &amp; FreshBhoj</p>
            </div>

            <p>
              FreshBhoj runs on a revenue-share model: a kitchen keeps the majority of what a
              customer pays for an order, and FreshBhoj keeps a commission. Nothing extra is
              charged to the customer just for using the app — browsing, ordering, subscribing and
              earning referral coins cost nothing beyond the price of the food.
            </p>
            <p>
              FreshBhoj earns more only when a kitchen chooses to spend more on growing — three
              optional, kitchen-side revenue streams sit on top of the base commission:
            </p>
            <div className={styles.cardGrid}>
              <div className={styles.card}><b>Boost / Ads spend</b><span>A kitchen paying to get a Reel shown to more people.</span></div>
              <div className={styles.card}><b>Premium Plan subscriptions</b><span>Recurring plans for extra tools and visibility (tiers shown earlier are early placeholder pricing, not finalized).</span></div>
              <div className={styles.card}><b>FSSAI Assistance fee</b><span>₹500 per request to handle a kitchen&apos;s food-licence paperwork (plus the ₹1,000 government fee, passed through unchanged).</span></div>
            </div>
            <p>
              This is the same basic shape as well-known food-delivery marketplaces — a commission
              on every order — with one difference: FreshBhoj builds real growth tools (ads, AI
              suggestions, premium tiers) directly into the platform as its own additional,
              entirely optional revenue layer, rather than leaving kitchens to find marketing help
              elsewhere.
            </p>
          </section>

          <section className={styles.feature}>
            <h3>Why This Works for Everyone</h3>
            <p>
              For a <strong>customer</strong>, FreshBhoj is a trustworthy way to eat real,
              home-style food — with actual nutrition numbers instead of guesswork, verified
              kitchens instead of anonymous listings, and a schedule that fits their life, whether
              that&apos;s a one-off order tonight or a hands-off weekly subscription. Referring a
              friend puts real money back in their pocket.
            </p>
            <p>
              For a <strong>kitchen partner</strong> — very often a home cook or a small operation
              with no marketing budget at all — FreshBhoj turns &quot;being good at cooking&quot;
              into an actual, growing business. Customers are found for them. Payments and payouts
              are handled for them. And when they&apos;re ready to grow further, there are real
              tools — Reels, Ads, AI-driven suggestions, Premium tiers — to do it, without needing
              to hire anyone or learn how digital advertising works.
            </p>
            <p>
              The reason this holds together: FreshBhoj&apos;s own biggest source of revenue is
              its commission on real orders (the exact rate is still being worked out) — which
              means FreshBhoj only really grows when kitchens are actually selling more food to
              happy customers. Both sides succeeding isn&apos;t a nice side-effect of the business
              model — it&apos;s the business model.
            </p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.footerWordmark}>FreshBhoj</div>
          <p>Fresh, home-style food — for the people who order it, and the kitchens who cook it.</p>
        </div>
      </footer>
    </div>
  );
}
