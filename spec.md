# NeoChainX

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Authentication system (signup/login with role-based access: user, admin)
- 4 digital knowledge products: Book 1 (₹1500), Book 2 (₹3000), Book 3 (₹5000), Book 4 (₹8000)
- Wallet system with pending/approved balance states
- Referral system: locked until first purchase, then unlocks unique referral link
- Referral commission: 20% of referred product price, auto-credited after purchase
- Task system: admin assigns tasks, users submit proof, admin approves/rejects
- Admin dashboard: user management, financial control, product control, referral control, task control, QR payment management, activity logs
- Payment system: manual QR-based (UPI, eSewa, Khalti, Crypto USDT), user uploads payment screenshot, admin verifies
- QR code management: admin uploads QR images per payment method
- In-app notifications
- Legal pages: Terms, Privacy, Refund, Disclaimer
- Analytics dashboard for admin: revenue, referrals, user growth
- Admin credentials: username `sandeep321`, password `Sandeep@321`

### Modify
N/A (new project)

### Remove
N/A

## Implementation Plan
1. Select components: authorization, blob-storage, user-approval
2. Generate Motoko backend with: users, products, purchases, wallet, referrals, tasks, payments, QR codes, notifications, admin controls
3. Build React frontend with glassmorphism/gradient premium UI:
   - Landing page with product showcase
   - Signup/login pages
   - User dashboard (wallet, referrals, tasks, purchases)
   - Product pages with locked previews
   - Checkout flow with QR payment + screenshot upload
   - Admin dashboard (fintech-style with all control panels)
   - Legal pages
