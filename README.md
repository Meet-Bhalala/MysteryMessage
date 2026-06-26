<h1 align="center">
  🔮 MysteryMessage
</h1>

<p align="center">
  <strong>Receive anonymous messages from anyone, anywhere — with full control over your privacy.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/NextAuth.js-4.x-purple?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/OpenAI-AI%20Suggestions-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🌟 Overview

**MysteryMessage** (also known as *True Feedback*) is a full-stack anonymous messaging platform where users can receive candid, honest feedback from anyone — without revealing the sender's identity. Share your unique profile link and let the world speak freely.

Whether you're looking for genuine feedback, fun questions, or anonymous opinions, MysteryMessage makes it safe and easy.

---

## ✨ Features

- 🕵️ **Fully Anonymous Messaging** — Senders remain completely anonymous; no account needed to send a message.
- 🔐 **Secure Authentication** — Full auth flow with NextAuth.js including sign-up, sign-in, and session management.
- 📧 **Email Verification** — OTP-based email verification on sign-up powered by [Resend](https://resend.com).
- 🤖 **AI-Powered Message Suggestions** — Uses the OpenAI API (with a smart local fallback) to suggest creative message ideas.
- 📋 **Shareable Profile Link** — Each user gets a unique public URL (`/u/[username]`) to share anywhere.
- 🔔 **Toggle Message Acceptance** — Users can turn anonymous message reception on or off at any time via the dashboard.
- 🗑️ **Message Management** — View and delete received anonymous messages from a clean dashboard.
- ✅ **Real-time Validation** — Zod schema-powered validation on both client and server side.
- 📱 **Responsive Design** — Works seamlessly on mobile, tablet, and desktop.
- 🎠 **Animated Landing Page** — Auto-playing message carousel on the home page with sample messages.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider) |
| **Email Service** | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| **AI Integration** | [OpenAI API](https://openai.com/) via [Vercel AI SDK](https://sdk.vercel.ai/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Styling** | [TailwindCSS 4](https://tailwindcss.com/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Carousel** | [Embla Carousel](https://www.embla-carousel.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) (Toast) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |

---

## 📁 Project Structure

```
mysterymessage/
├── emails/
│   └── VerificationEmail.tsx       # React Email OTP verification template
├── src/
│   ├── app/
│   │   ├── (app)/                  # Main app route group
│   │   │   ├── dashboard/          # User dashboard (view/delete messages, toggle settings)
│   │   │   └── page.tsx            # Landing page with animated carousel
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── sign-in/            # Sign-in page
│   │   │   ├── sign-up/            # Sign-up page
│   │   │   └── verify/             # OTP email verification page
│   │   ├── api/
│   │   │   ├── auth/               # NextAuth.js handler ([...nextauth])
│   │   │   ├── accept-messages/    # GET/POST toggle message acceptance
│   │   │   ├── check-username-unique/  # GET check username availability
│   │   │   ├── delete-message/     # DELETE remove a specific message
│   │   │   ├── get-messages/       # GET fetch all messages for logged-in user
│   │   │   ├── send-message/       # POST send an anonymous message
│   │   │   ├── sign-up/            # POST register a new user
│   │   │   ├── suggest-message/    # POST AI-powered message suggestions (streaming)
│   │   │   └── verify-code/        # POST verify OTP code
│   │   ├── u/
│   │   │   └── [username]/         # Public profile page for receiving messages
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── MessageCard.tsx         # Individual message display with delete action
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── SendMessageForm.tsx     # Anonymous message form with AI suggestions
│   ├── helpers/
│   │   └── sendVerificationEmail.ts  # Resend email utility
│   ├── lib/
│   │   └── dbConnect.ts            # MongoDB connection singleton
│   ├── model/
│   │   └── User.ts                 # Mongoose User & Message schemas/models
│   ├── schemas/
│   │   ├── acceptMessageSchema.ts  # Zod schema for message acceptance toggle
│   │   ├── messageSchema.ts        # Zod schema for message content (10-300 chars)
│   │   ├── signInSchema.ts         # Zod schema for sign-in
│   │   ├── signUpSchema.ts         # Zod schema for sign-up with username regex
│   │   └── verifySchema.ts         # Zod schema for OTP code
│   ├── types/
│   │   └── ApiResponse.ts          # Shared API response types
│   ├── context/                    # React context providers
│   ├── messages.json               # Sample messages for home page carousel
│   └── proxy.ts                    # NextAuth type augmentation
├── .env                            # Environment variables (see below)
├── components.json                 # shadcn/ui configuration
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔄 User Flow

```
Sign Up → Email OTP Verification → Sign In
  ↓
Dashboard
  ├── Copy shareable profile link (/u/username)
  ├── Toggle anonymous message acceptance ON/OFF
  ├── View all received anonymous messages
  └── Delete unwanted messages

Public Profile (/u/username)
  ├── Anyone visits the link (no login required)
  ├── Types an anonymous message (10–300 characters)
  ├── Optionally uses AI-suggested prompts
  └── Message delivered privately to the user's dashboard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** account (free tier works)
- A **Resend** account for email delivery (free tier: 100 emails/day)
- *(Optional)* An **OpenAI** API key for AI message suggestions

### 1. Clone the Repository

```bash
git clone https://github.com/Meet-Bhalala/MysteryMessage.git
cd mysterymessage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/DATABASE_MYSTERYMESSAGE"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
NEXTAUTH_SECRET="your-super-secret-random-string"
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"   # Optional — AI suggestions fall back gracefully
```

> See the [Environment Variables](#-environment-variables) section for detailed setup instructions.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URL` | ✅ Yes | MongoDB Atlas connection string. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas). |
| `RESEND_API_KEY` | ✅ Yes | API key from [resend.com](https://resend.com). Used to send OTP verification emails. |
| `NEXTAUTH_SECRET` | ✅ Yes | A random string for signing JWTs. Generate with: `openssl rand -hex 32` |
| `OPENAI_API_KEY` | ⚠️ Optional | OpenAI API key for AI message suggestions. If missing or empty, falls back to a built-in local pool of suggestions. |

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 📡 API Reference

All API routes are under `/api/`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sign-up` | ❌ Public | Register a new user; sends OTP email |
| `POST` | `/api/verify-code` | ❌ Public | Verify the OTP code sent to user's email |
| `GET` | `/api/check-username-unique` | ❌ Public | Check if a username is available (`?username=xxx`) |
| `POST` | `/api/auth/[...nextauth]` | ❌ Public | NextAuth.js sign-in/sign-out handler |
| `GET` | `/api/accept-messages` | 🔐 Auth | Fetch current message acceptance status |
| `POST` | `/api/accept-messages` | 🔐 Auth | Toggle message acceptance on/off |
| `GET` | `/api/get-messages` | 🔐 Auth | Fetch all received messages for logged-in user |
| `DELETE` | `/api/delete-message` | 🔐 Auth | Delete a specific message by ID |
| `POST` | `/api/send-message` | ❌ Public | Send an anonymous message to a username |
| `POST` | `/api/suggest-message` | ❌ Public | Stream AI-generated message suggestions |

---

## 🗃 Data Models

### User

```typescript
{
  username:            string   // Unique, trimmed
  email:               string   // Unique, validated format
  password:            string   // bcrypt hashed
  verifyCode:          string   // 6-digit OTP
  verifyCodeExpires:   Date     // OTP expiry timestamp
  isVerified:          boolean  // Default: false
  isAccecptingMessages: boolean // Default: true
  messages:            Message[] // Embedded array
}
```

### Message (Embedded in User)

```typescript
{
  content:   string  // Anonymous message text
  createdAt: Date    // Auto-set on creation
}
```

---

## 🤖 AI Suggestions Feature

The `/api/suggest-message` endpoint uses the **Vercel AI SDK** with OpenAI to stream 3 creative question suggestions for message senders, separated by `||`.

**Fallback behavior:** If the OpenAI API key is not configured or the API call fails, the `SendMessageForm` component automatically falls back to a curated local pool of 12 suggestions, randomly selecting 3 to display. This ensures the feature always works — even without an API key.

---

## 🔒 Security Highlights

- Passwords are **hashed with bcryptjs** before storage — never stored in plain text.
- OTP codes expire after a set time to prevent replay attacks.
- Username validation enforces a strict regex pattern to prevent injection.
- NextAuth.js session cookies are signed with `NEXTAUTH_SECRET`.
- Message acceptance can be toggled off to stop receiving messages entirely.
- Zod validates all inputs on both client and server.

---

## 📬 Email Verification Flow

1. User signs up with username, email, and password.
2. A 6-digit OTP is generated and saved to MongoDB with an expiry timestamp.
3. [Resend](https://resend.com) sends a beautifully designed HTML email (built with [React Email](https://react.email/)) to the user.
4. The user enters the OTP on the `/verify/[username]` page.
5. On success, `isVerified` is set to `true` and the user is redirected to sign in.

---

## 🚢 Deployment

### Deploy on Vercel *(Recommended)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repository to GitHub.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Set all required environment variables in the Vercel dashboard under **Settings → Environment Variables**.
4. Deploy!

> Make sure your MongoDB Atlas cluster allows connections from Vercel's IP ranges (or set it to allow all IPs: `0.0.0.0/0`).

### Other Platforms

The app can be deployed on any platform that supports Node.js:

- **Railway** — Connect your GitHub repo and add environment variables.
- **Render** — Use the Node.js environment with `npm run build && npm start`.
- **AWS / GCP / Azure** — Containerize with Docker and deploy to your preferred cloud.

---

## 🧑‍💻 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please follow the existing code style and ensure ESLint passes before submitting.

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute it as you see fit.

---

<p align="center">
  Built with ❤️ using <strong>Next.js</strong>, <strong>MongoDB</strong>, and <strong>OpenAI</strong>
</p>
