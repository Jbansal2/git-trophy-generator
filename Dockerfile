# Use official Deno image
FROM denoland/deno:2.9.5

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Cache dependencies
RUN deno cache server.ts

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD deno eval "try { await fetch('http://localhost:3000/health'); Deno.exit(0); } catch { Deno.exit(1); }"

# Start application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "server.ts"]
