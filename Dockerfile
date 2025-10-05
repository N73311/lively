# Build stage for React client
FROM node:14-alpine AS client-build

WORKDIR /src/client-app

# Copy package files
COPY client-app/package*.json ./

# Install dependencies
RUN npm install

# Copy client source
COPY client-app/ ./

# Build the React app and ensure build folder exists
RUN GENERATE_SOURCEMAP=false CI=true npx react-scripts build && \
    ls -la && \
    test -d build

# Build stage for .NET
FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build

WORKDIR /src

# Copy project file
COPY API/*.csproj ./API/

# Restore dependencies
RUN dotnet restore API/API.csproj

# Copy everything
COPY . .

# Build and publish
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:3.1

WORKDIR /app

# Copy .NET app
COPY --from=build /app/publish .

# Copy React app to wwwroot
COPY --from=client-build /src/client-app/build ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Environment variables for AWS SES
ENV USE_AWS_SES=true
ENV AWS_REGION=us-east-1
ENV EMAIL_FROM="Lively <lively@zachayers.io>"

EXPOSE 5000

ENTRYPOINT ["dotnet", "API.dll"]