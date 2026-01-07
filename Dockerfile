# Step 1: Build Stage (Builds the Next.js app)
FROM node:18 AS build

WORKDIR /app

# Copy only necessary files for installation
COPY package.json package-lock.json bun.lockb ./
RUN npm install -g bun
RUN bun install

# Copy all application files to the container
COPY . .

# Build the Next.js app
RUN npx next build

# Step 2: Production Stage (Serving with a Lightweight Image)
FROM node:18-alpine AS production

WORKDIR /app

# Copy only the build output from the previous stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public

# Environment Variables (if needed)
ENV NODE_ENV=production
ENV PORT=5173

# Expose the port
EXPOSE 5173

# Start the Next.js app
CMD ["npx", "next", "start", "-p", "5173"]
