FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/EducaNet.API/EducaNet.API.csproj", "src/EducaNet.API/"]
COPY ["src/EducaNet.Application/EducaNet.Application.csproj", "src/EducaNet.Application/"]
COPY ["src/EducaNet.Domain/EducaNet.Domain.csproj", "src/EducaNet.Domain/"]
COPY ["src/EducaNet.Infrastructure/EducaNet.Infrastructure.csproj", "src/EducaNet.Infrastructure/"]
RUN dotnet restore "src/EducaNet.API/EducaNet.API.csproj"
COPY . .
WORKDIR "/src/src/EducaNet.API"
RUN dotnet build "EducaNet.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EducaNet.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "EducaNet.API.dll"]
