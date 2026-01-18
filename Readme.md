#Backend Structure

/Backend
├── /src
│   ├── /config             # Database & OAuth configurations
│   │   └── db.js           # MongoDB connection logic
│   ├── /controllers        # Route handlers 
│   ├── /middlewares        # Security & Error handling
│   ├── /models             # Mongoose Schemas 
│   ├── /routes             # API Endpoint definitions
│   ├── /socket             # Real-time event handling (Socket.io)
│   ├── /utils              # Helper functions (JWT, Cloudinary)
│   └── server.js           # App entry point & Socket initialization
├── .env                    # Private environment variables
├── .env.sample             # Template for environment variables
├── .gitignore              # Files to be ignored by Git
├── package.json            # Scripts & Dependencies
└── Readme.md               # Project documentation