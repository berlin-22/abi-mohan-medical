FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and static assets
COPY . .

# Expose port (overridden by $PORT in cloud environments)
EXPOSE 3000

CMD ["python", "server.py"]
