import axios from "axios";
import base64url from "base64url";
import { GoogleParametersBuilder } from "../../builder/GoogleParametersBuilder";
import express from "express";
import { GoogleUser } from "types/GoogleUser";

const { GOOGLE_KEY, GOOGLE_SECRET, BASE_URL } = process.env;

export namespace GoogleRoutes {
  export function register(app: { use: Function }): void {
    const routes = express.Router();
    routes.get("/auth", async (req, res) => {
      const { code, error } = req.query as { code: string; error: string };
      if (error) {
        res.status(401).send({ error });
        return;
      }

      try {
        const response = await axios.post(
          new GoogleParametersBuilder("https://oauth2.googleapis.com/token")
            .withClientId(GOOGLE_KEY)
            .withClientSecret(GOOGLE_SECRET)
            .withCode(code)
            .withRedirectURL(`${BASE_URL}/google/auth`)
            .withGrantType("authorization_code")
            .build()
        );

        const { id_token } = response.data;
        const [_, payload] = id_token.split(".");
        const user = JSON.parse(base64url.decode(payload)) as GoogleUser;
        console.dir(user);
      } catch (error) {
        console.dir(error.response.data);
        res.send('<h1 style="color: red;"> Oops something went wrong </h1>');
      }

      res.send("<h1> Done! </h1>");
    });
  }
}
