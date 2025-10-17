import app from "./app";

const port = Number(process.env.PORT) || 3001;

// app.listen(port, () => console.log(`Verification service listening on ${port}`));
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Issue Service running on port ${port}`));
}