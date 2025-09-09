## Google Docs Clone Using Next.js Firebase, and Stream

This Google Docs clone is built with Next.js, Firebase, and the Stream Chat SDK. Users can sign in with their Gmail accounts and collaborate in real-time. The app uses QuillJS to provide a rich WYSIWYG editor, Next.js for full-stack development, and the [Stream Chat SDK](https://getstream.io/chat/sdk/) to synchronize live changes across multiple users.

## Getting Started

- Clone the GitHub repository
- Install the package dependencies.
  ```bash
  npm install
  ```
- Create a [Firebase app with Authentication and Firebase Firestore features](https://firebase.google.com/)

- Update the [firebase.ts](https://github.com/dha-stix/stream-loom-clone/blob/main/src/lib/firebase.ts) file with your Firebase configuration code.

- Create your [Stream account](https://getstream.io/try-for-free/) and also add your Stream credentials into the **`env.local`** file.

  ```bash
  NEXT_PUBLIC_STREAM_API_KEY=
  STREAM_SECRET_KEY=
  NEXT_PUBLIC_HOST=http://localhost:3000
  ```
- Install the [Stream Chat extension](https://extensions.dev/extensions/stream/auth-chat) to your Firebase app.
  
- Finally, start the development server by running the code snippet below:
  ```bash
  npm run dev
  ```

## Tools

👉🏻 [Stream Chat SDK](https://getstream.io/chat/)

👉🏻 [Stream Chat x Firebase Extension](https://extensions.dev/extensions/stream/auth-chat)
