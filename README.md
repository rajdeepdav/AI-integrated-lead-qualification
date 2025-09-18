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
<img width="1359" height="898" alt="image" src="https://github.com/user-attachments/assets/229243a2-76dc-4d8e-91b8-5cecca8f3883" />


# Score leads

curl -X POST http://localhost:3000/score
<img width="1362" height="569" alt="image" src="https://github.com/user-attachments/assets/90705ead-86ca-4a58-9769-3d81f952e276" />


# Get all leads

curl -X GET http://localhost:3000/leads
<img width="1366" height="827" alt="image" src="https://github.com/user-attachments/assets/7f1b7233-8f83-417f-b50d-1e78001d9761" />

Vercel link
https://ai-integrated-lead-git-58dbc3-rajdeep-singhs-projects-79fc7195.vercel.app

https://ai-integrated-lead-git-58dbc3-rajdeep-singhs-projects-79fc7195.vercel.app/score
