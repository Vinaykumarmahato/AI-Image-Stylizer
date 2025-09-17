# ✨ AI Image Stylizer 🎨

Welcome to the **AI Image Stylizer**!  
This is a full-stack web application that leverages the power of **Google's Generative AI** to transform your photos into stunning, unique works of art.  
It features a **secure Java Spring Boot backend** and a **dynamic, beautifully animated React frontend**.

---

![Demo GIF](https://placehold.co/800x400/0c0a18/a78bfa?text=App+Demo+GIF)  
*(Imagine a cool GIF of the app in action here!)*

---

## 🚀 Key Features

- ✨ **AI-Powered Transformations**: Restyle your photos using natural language prompts.
- 🎨 **Creative Style Presets**: One-click styles — *Cinematic*, *Vintage*, *Fantasy*, *Anime*, *Watercolor*.
- 🚀 **Multi-Image Queue**: Upload and process multiple images with live status (`Queued`, `Processing`, `Done`, `Error`).
- ↔️ **Before & After Slider**: Compare original vs. AI-stylized photo with an interactive slider.
- 💅 **Modern Animated UI**: Glassmorphism, aurora backgrounds, and smooth Framer Motion animations.
- 🔒 **Secure Architecture**: API key hidden on the backend — never exposed in the browser.

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

## 🛠️ Setup & Installation

To run this project locally, you'll need to run both the backend server and the frontend client.

### 1. Backend Setup (Java Spring Boot)

1.  **Navigate to the backend directory:**
    ```bash
    cd java-backend
    ```
2.  **Add your API Key:**
    - Open `src/main/resources/application.properties`.
    - Replace `YOUR_API_KEY_HERE` with your actual Google AI API key.
3.  **Run the server:**
    ```bash
    mvn spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### 2. Frontend Setup (React)

1.  **Serve the frontend:**
    - From the project's root directory, you can use a simple static server. `serve` is a great option.
    ```bash
    # If you don't have serve, install it globally
    npm install -g serve

    # Run the server from the root directory
    serve
    ```
    The frontend will be available at a local port (e.g., `http://localhost:3000`).

2.  **Proxy Configuration (Important for Development):**
    - The frontend makes API calls to `/api/stylize`. For this to work, the browser needs to think the frontend and backend are on the same server. When deploying, you'd configure a reverse proxy (like in Nginx).
    - For local development with a tool like Vite, you would add a `proxy` rule to `vite.config.ts` to forward `/api` requests to `http://localhost:8080`.

---

## 🎓 Interview Preparation Guide

This project is an excellent talking point in an interview. Here are potential questions and how you can answer them by referencing this project.

### 🌟 **General / High-Level Questions**

*   **"Can you walk me through this project?"**
    > **Answer:** "Certainly. I built the 'AI Image Stylizer,' a full-stack web application that allows users to transform their photos using Generative AI. It features a React/TypeScript frontend for a dynamic user experience and a secure Java Spring Boot backend that communicates with the Google Gemini API. The goal was to create a tool that is not only powerful but also highly engaging and secure, with features like multi-image processing and an interactive 'before and after' comparison slider."

*   **"What are you most proud of in this project?"**
    > **Answer:** "I'm most proud of the interactive **'Before & After' slider**. It was a custom component I built from scratch that significantly enhances the user experience. It directly visualizes the value of the AI transformation in a really satisfying way. I'm also proud of the secure architecture, which correctly protects the API key on the backend, a critical consideration for any AI application."

### 🏛️ **Architecture & Backend Questions**

*   **"Why did you choose a client-server architecture instead of calling the AI API directly from the frontend?"**
    > **Answer:** "That's a great question, and it comes down to one critical reason: **security**. Exposing the Google AI API key on the frontend would allow anyone to find and use it, leading to security risks and potential costs. By creating a Java backend, I made a secure proxy. The frontend talks to my server, and my server, where the key is safely stored, talks to the AI. This also improves scalability and allows me to add more complex logic, like rate limiting or caching, on the server in the future."

*   **"How do the frontend and backend communicate?"**
    > **Answer:** "They communicate via a RESTful API. The frontend sends a `POST` request to the `/api/stylize` endpoint on the Java server. The request body is `multipart/form-data`, which is ideal for sending binary data like an image file along with text data like the prompt."

*   **"What's the purpose of the `GlobalExceptionHandler` in your Spring Boot app?"**
    > **Answer:** "The `GlobalExceptionHandler` centralizes all error handling. Instead of writing `try-catch` blocks in every controller, this class intercepts exceptions from anywhere in the application. It ensures that no matter what goes wrong—a validation error, an AI API failure—the frontend will always receive a clean, predictable JSON error response, which I can then use to display a helpful message to the user."

### 🎨 **Frontend & UI/UX Questions**

*   **"Why did you choose React and TypeScript?"**
    > **Answer:** "I chose **React** for its component-based architecture, which makes building complex UIs like this one manageable and reusable. The virtual DOM also ensures excellent performance. I added **TypeScript** on top for type safety. In a project with complex state objects like my `ImageJob` array, TypeScript was invaluable for preventing common bugs and making the code easier to refactor and maintain."

*   **"How did you implement the animations? Why Framer Motion?"**
    > **Answer:** "I used **Framer Motion**, a production-ready animation library for React. I chose it because it has a simple, declarative API that integrates perfectly with React components. It allowed me to easily implement complex animations like the staggered entry of the result cards (`staggerChildren`) and layout animations for the processing queue, which would have been much more complex to write manually in CSS or another library."

*   **"Explain how your state management works for the image queue."**
    > **Answer:** "I managed the state using React's `useState` hook. The core piece of state is an array of `ImageJob` objects. Each object contains the file, a preview URL, and its current status (`queued`, `processing`, etc.). When the user clicks 'Stylize,' I iterate through this array, updating the status of each job **immutably** by creating a new array with the updated job object. This triggers React to re-render the specific component for that job, showing the user real-time progress without blocking the UI."

*   **"How does the interactive 'Before & After' slider work?"**
    > **Answer:** "The slider is a custom React component. It works by overlaying the stylized image on top of the original. I then use the CSS `clip-path` property on the top image. The slider's position, which is a percentage from 0 to 100, is controlled by a React state variable. I attached event listeners (`onMouseDown`, `onMouseMove`, `onMouseUp`) to the container to track the user's mouse movement when they drag, updating the state and thus the `clip-path` in real-time. This creates a smooth and performant reveal effect."
