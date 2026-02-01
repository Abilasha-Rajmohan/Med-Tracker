FROM postgres:latest
LABEL maintainer="Team 86 CS6440"

# Set the environment variables for PostgreSQL
ENV POSTGRES_USER=postgresuser
ENV POSTGRES_PASSWORD=postgrespass
ENV POSTGRES_DB=projectdb

# Copy the SQL file to the Docker image at the appropriate location
COPY create_table_project.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# The default entrypoint for the PostgreSQL image will run scripts in /docker-entrypoint-initdb.d
