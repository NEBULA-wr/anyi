# For Anyari - Romantic Multimedia Gallery

This is a personalized web application created as a romantic gift for Anyari. It features a curated playlist of songs, a gallery of photos and videos, and special animations including a "CapCut-style" intro sequence.

## Features

- **Intro Sequence:** Plays highlights from 8 specific songs with synchronized lyrics and animations.
- **"TE AMO ANYARI" Reveal:** A special animation at the end of the intro sequence.
- **Multimedia Gallery:** Displays photos and videos with a film-strip aesthetic.
- **Romantic Lyrics:** Displays meaningful lyrics that fade in and out.
- **Responsive Design:** Works on desktop and mobile devices.

## How to Run Locally

1.  **Install Node.js:** Ensure you have Node.js installed on your computer.
2.  **Download the Project:** Download the source code from the AI Studio interface.
3.  **Install Dependencies:** Open a terminal in the project folder and run:
    ```bash
    npm install
    ```
4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
5.  **Open in Browser:** Visit `http://localhost:5173` (or the port shown in your terminal).

## Customization

-   **Songs:** Edit `src/data.ts` to change song titles, artists, and URLs.
-   **Images/Videos:** Update the `mediaItems` array in `src/data.ts` with your own photo and video URLs.
-   **Lyrics:** Modify the `lyrics` array in `src/data.ts` to change the displayed text.

## Technologies Used

-   React
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Vite
