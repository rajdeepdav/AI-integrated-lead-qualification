# Clone repo

git clone <repo-url>
cd <project-folder>

# Install dependencies

npm install

# Set environment variables

export OPENAI_API_KEY=<your-key>
export DATABASE_URL=<your-db-connection>

# Run server

node src/server.js

# Upload leads

curl -X POST http://localhost:3000/leads/upload -F 'file=@leads.csv'

# Score leads

curl -X POST http://localhost:3000/score

# Get all leads

curl -X GET http://localhost:3000/leads

Vercel link
https://ai-integrated-lead-git-58dbc3-rajdeep-singhs-projects-79fc7195.vercel.app

https://ai-integrated-lead-git-58dbc3-rajdeep-singhs-projects-79fc7195.vercel.app/score
