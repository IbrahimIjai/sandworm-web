# SandWorm WebApp

This repo is the frontend interface for SandWorm, a blockchain data indexer for the Sui network (and possibly other chains support in the future). This repository contains the web-based UI, including the **landing page**, **public gists**, and the **integrated IDE** for querying blockchain data with SandWorm's SQL-like query language (WQL).

## 🚀 Features

- **Landing Page** – Introduces SandWorm and its capabilities, TOC's, turtorials.
- **Public Gists** – View and share useful queries with the community.
- **IDE** – An interactive environment to write, test, and execute WQL queries. (/Workspace)

---

## 📖 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (Latest LTS recommended)
- **Yarn** or **npm** or **pnpm**
- **Firebase CLI** (for local emulation, optional)

### Environment Variables

Copy the example `.env` file and configure it with the necessary values:

```sh
cp .env.example .env.local
```

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/sand-worm-sql/web-app.git
cd webapp
pnpm install  # or npm install
```

### Running the App

To start the development server:

```sh
pnpm run dev  # or npm run dev
```

This will start the Next.js development server on `http://localhost:3000/`.

---

## 🔥 Firebase Emulator Setup

If you want to use the Firebase emulator for local development:

1. Install Firebase CLI:
   ```sh
   pnpm install -g firebase-tools
   ```
2. Login to Firebase:
   ```sh
   firebase login
   ```
3. Start the Firebase emulator:
   ```sh
   firebase emulators:start
   ```
   By default, the app is set up to work with a live Firebase instance. Update your `.env.local` file if you want to switch between live and emulator.

If you get could not spawn java version or java path error. You need to install java and set to path for the emulator to run

---

## 📂 Repository Structure

This repository follows a structured approach with relevant documentation in place:

- **`/public`** – Static assets.
- **`/src/components`** – Reusable React components.
- **`/src/app`** – Page routes.
- **`/docs`** – Additional documentation.
- **`/README.md`** – This document.
- **`/DEVELOPER_NOTE.md`** – Developer-specific notes, guidelines, and pending features.
- **Folder-specific README files** – Some folders contain dedicated README files listing pending features or developer notes.

---

## 🛠 Contributing

To contribute

1. Read our **[Contributing Guidelines](CONTRIBUTING.md)** (to be added).
2. Check the **Developer Notes** (`DEVELOPER_NOTE.md`) for pending features.
3. Follow the project structure and coding guidelines.

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 📫 Contact

For any questions, feel free to open an issue or reach out to the team through our official channels.

---
