import app from "./app";

const server = app.listen(app.get("port"), () => {
  console.log(`Server is running at ${app.get("port")}`);
  console.log("Press Ctrl+C to stop");
});


export default server;