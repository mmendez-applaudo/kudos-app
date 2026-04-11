FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/KudosApp.Api/KudosApp.Api.csproj", "src/KudosApp.Api/"]
COPY ["src/KudosApp.Application/KudosApp.Application.csproj", "src/KudosApp.Application/"]
COPY ["src/KudosApp.Domain/KudosApp.Domain.csproj", "src/KudosApp.Domain/"]
COPY ["src/KudosApp.Infrastructure/KudosApp.Infrastructure.csproj", "src/KudosApp.Infrastructure/"]
RUN dotnet restore "src/KudosApp.Api/KudosApp.Api.csproj"
COPY . .
WORKDIR "/src/src/KudosApp.Api"
RUN dotnet build "KudosApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KudosApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KudosApp.Api.dll"]
