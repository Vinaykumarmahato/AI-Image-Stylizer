# ✨ AI Image Stylizer 🎨

Welcome to the AI Image Stylizer! This is a powerful, client-side web application that leverages Google's Gemini API to transform your photos into stunning, unique works of art directly in your browser.

![Demo GIF Placeholder](https://placehold.co/800x400/0c0a18/a78bfa?text=App+Demo+GIF)
*(Imagine a cool GIF of the app in action here!)*

---

## 🚀 Key Features

- 🔑 **Easy Setup**: No environment variables needed! Enter your Google AI API key directly in the app to get started instantly. Your key is used only for your current session.
- ✨ **Direct AI Transformations**: Uses the `@google/genai` SDK to communicate directly with the Gemini API, transforming images based on your text prompts.
- 🎨 **Creative Style Presets**: Get started quickly with one-click style presets like *Cinematic*, *Vintage*, *Fantasy*, *Anime*, and *Watercolor*.
- 🚀 **Multi-Image Processing Queue**: Upload and process multiple images at once. The UI provides real-time status updates (`Queued`, `Processing...`, `Done`, `Error`) for each image.
- ↔️ **Interactive Before & After Slider**: A custom-built, engaging slider lets you seamlessly compare the original photo with the new AI-generated version.
- 💅 **Modern & Animated UI**: The interface is built for a premium user experience, featuring a "glassmorphism" design, a dynamic "aurora" background, and fluid animations powered by Framer Motion.

---
## 💻 Technology Stack

### 🎨 Frontend
- 🔵 **TypeScript** — Robust, type-safe code
- ⚛️ **React** — Component-based UI
- 💨 **Tailwind CSS** — Utility-first responsive styling
- 🎬 **Framer Motion** — Declarative UI animations
- 📦 **Vite / esbuild** — Lightning-fast development

### ⚙️ Backend
- ☕ **Java & Spring Boot** — Scalable, secure REST API
- 🤖 **Google AI for Java SDK** — Connects with Gemini API
- 📦 **Maven** — Dependency management

### 🧠 Artificial Intelligence
- 🤖 **Google Gemini API** — Core generative model powering transformations
---

## 🛠️ How to Run

This is a static web application that can be run with any simple web server.

### Prerequisites

1.  **A Google AI API Key.** You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **A simple web server.** We recommend using `serve`.

### Running with `serve`

1.  **Install `serve`:**
    If you don't have it, install it globally using Node.js/npm:
    ```bash
    npm install -g serve
    ```

2.  **Run the Server:**
    From the project's root directory, simply run:
    ```bash
    serve
    ```
    The server will start and provide you with a local URL (e.g., `http://localhost:3000`).

3.  **Use the App:**
    - Open the provided URL in your browser.
    - Paste your Google AI API key into the input field.
    - Start uploading and stylizing your images!

### 🚀 Running in VS Code

You can easily run the application using VS Code's integrated terminal.

1.  **Open the Project:**
    Open the root folder of the project in VS Code.

2.  **Open the Terminal:**
    Use the shortcut (`Ctrl+`` or `Cmd+``) to open an integrated terminal.

3.  **Run the `serve` command:**
    ```bash
    serve
    ```
    Click the link that appears in the terminal to open the application in your browser.

---

## 🎓 Interview Preparation Guide

This project is an excellent talking point in an interview. Here are potential questions and how you can answer them by referencing this project.

### 🌟 **General / High-Level Questions**

*   **"Can you walk me through this project?"**
    > **Answer:** "Certainly. I built the 'AI Image Stylizer,' a client-side web application that allows users to transform their photos using Google's Generative AI. It's built with React and TypeScript and communicates directly with the Gemini API via the official SDK. The focus was on creating a highly interactive and responsive user experience, with features like an in-app API key input, a multi-image processing queue, and a custom-built 'before and after' comparison slider."

*   **"What are you most proud of in this project?"**
    > **Answer:** "I'm most proud of the interactive **'Before & After' slider**. It was a custom component I built from scratch that significantly enhances the user experience by directly visualizing the value of the AI transformation. I'm also proud of the efficient client-side implementation; by using the Gemini SDK directly, I removed the need for a backend server, simplifying deployment and reducing infrastructure complexity for this specific use case."

### 🏛️ **Architecture & Technical Questions**

*   **"You're calling the AI API directly from the frontend. What are the security implications?"**
    > **Answer:** "That's a critical consideration. For this application, which is designed as a portfolio piece or a demo, I've implemented an in-app API key input field. The key is stored in React state and is only held in memory for the duration of the browser session. It's never persisted. This approach prioritizes ease of use, allowing anyone to run the project locally without configuring environment variables.
    >
    > However, for a production application, this method would expose the user's API key to browser extensions or XSS attacks. The more secure, production-ready pattern is to use a backend-for-frontend (BFF) or a serverless function that acts as a proxy. The client would authenticate with the BFF, which would then securely attach the API key (stored as a server-side secret) to the request before forwarding it to the Gemini API. This prevents the API key from ever being exposed on the client-side."

*   **"How do you handle API calls and manage the state of multiple image uploads?"**
    > **Answer:** "I use React's `useState` hook to manage an array of `ImageJob` objects. When a user uploads files, I create a job object for each one with a `queued` status. When they click 'Stylize,' I iterate through the queued jobs asynchronously. For each job, I call an `editImageWithAI` service function which contains the Gemini SDK logic. I update the job's status to `processing`, and then to `done` or `error` upon completion. The state updates are immutable—I always create a new array—which triggers React to efficiently re-render only the components that have changed, providing real-time feedback to the user."

### 🎨 **Frontend & UI/UX Questions**

*   **"How did you implement the animations? Why Framer Motion?"**
    > **Answer:** "I used **Framer Motion**, a production-ready animation library for React. I chose it because of its simple, declarative API that integrates seamlessly with React components. It allowed me to easily implement complex layout animations in the processing queue and staggered entry animations for the result cards (`staggerChildren`), creating a polished and fluid user experience that would be much more complex to achieve with CSS alone."

*   **"How does the interactive 'Before & After' slider work?"**
    > **Answer:** "The slider is a custom React component. It works by overlaying the stylized image on top of the original image. The top image's visibility is controlled by the CSS `clip-path` property. I use a React state variable to store the slider's position as a percentage. I've attached mouse and touch event listeners (`onMouseDown`, `onMouseMove`, `onTouchStart`, etc.) to the container. When a user drags the slider handle, these listeners update the state, which in turn updates the `clip-path` in real-time. This creates a smooth and performant reveal effect without needing to manipulate image data directly."
