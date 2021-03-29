import { JWTMediator } from "api/routes/middlewares";
import { CamperService } from "api/services/CamperService";
import axios from "axios";
import base64url from "base64url";
import { GoogleParametersBuilder } from "builder/GoogleParametersBuilder";
import { Request, Response } from "express";
import { CamperCreationAttributes } from "models";
import { GoogleUser } from "types/GoogleUser";

const { GOOGLE_KEY, GOOGLE_SECRET, BASE_URL } = process.env;

export class GoogleController {
  constructor(private camperService: CamperService) {}

  public handleAuth = async (req: Request, res: Response) => {
    const { code } = req.query as { code: string };
    const user = await this.getUserFromGoogle(code);
    const camper = await this.camperService.findByGoogleId(user.sub);

    if (!camper) {
      const newCamper = await this.createNewCamper(user);
      res.json(newCamper);
    }

    const token = JWTMediator.sign({
      idCamper: Number(camper.idCamper),
      password: "",
    });

    res.json({ camper, token });
  };

  private createNewCamper = (user: GoogleUser) => {
    const camper: CamperCreationAttributes = {
      blRegisterCompleted: false,
      dsEmail: user.email,
      dsImageURL: user.picture,
      dsName: user.name,
      idGoogle: user.sub,
    };
    return this.camperService.create(camper);
  };

  private getUserFromGoogle = async (code: string): Promise<GoogleUser> => {
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
    return JSON.parse(base64url.decode(payload));
  };
}
