import { CommonConfig } from "@/Common/CommonConfig";
import { Game } from "../game";
import { Container } from "pixi.js";

export class APICalls extends Container {
  constructor() {
    super();
    // Game.the.app.stage.on(
    //   CommonConfig.FETCH_GAME_INITIAL_RESPONSE,
    //   this.generatePayloadPath,
    //   this
    // );
  }

  private generatePayloadPath(): void {
    const baseUrl = CommonConfig.BASE_URL;
    const path = CommonConfig.GENERATE_PAYLOAD_PATH;
    const generatePayloadPa = async () => {
      const data = {
        templateId: CommonConfig.TEMPLATE_ID,
      };

      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            // logOut();
            throw new Error("Unauthorized");
          }
        }

        const result = await response.json();

        return result;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData = async () => {
      const response = await generatePayloadPa();
      console.log(response);
    };

    fetchData();
  }
}
