import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const api = service("invitro-api", {
    start: "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    healthcheck: "/health",
    healthcheckTimeout: 10,
    build: {
      dockerfilePath: "backend/Dockerfile",
      context: "backend",
    },
  });

  return project("invitro-api", {
    resources: [api],
  });
});
