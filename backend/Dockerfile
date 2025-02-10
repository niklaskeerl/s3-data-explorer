ARG PYTHON_BASE=3.13.1-slim

# Build stage
FROM python:$PYTHON_BASE AS build

COPY pyproject.toml pdm.lock ./

# Install pdm
RUN python -m pip install --upgrade pip setuptools wheel &&\
    pip install pdm

# Install dependencies
RUN pdm install --no-lock --no-editable


# Run stage
FROM python:$PYTHON_BASE

# Copy application files
COPY app /app

COPY --from=build /.venv /.venv
ENV PATH="/.venv/bin:{$PATH}"

EXPOSE 5002

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5002"]