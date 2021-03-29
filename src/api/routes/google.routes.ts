import express from "express";

export namespace GoogleRoutes {
  export function register(app: { use: Function }): void {
    const routes = express.Router();
    routes.get("/auth", async (req, res) => {
      const { code, error } = req.query;
      if (error) {
        res.status(401).send({ error });
        return;
      }

      console.log("----------------------------------");
      console.log("Code: ", code);
      console.log("----------------------------------");
      res.send("<h1> Done! </h1>");
    });
    app.use("/google", routes);
  }
}
