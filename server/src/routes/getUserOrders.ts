import axios from "axios";
import { Response, Request, Router, NextFunction } from "express";
const router = Router();
require("dotenv").config();

router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.query;

    const userIdQuery: string = (userId as string) ?? "";

    if (userIdQuery !== "") {
      try {
        console.log(userIdQuery, "query");
        const { data } = await axios({
          url: "https://henry-pg-api.herokuapp.com/v1/graphql",
          method: "POST",
          data: {
            query: getUserOrdersQuery(userIdQuery),
          },
        });

        if (data.errors) {
          response.send(data.errors);
        } else {
          console.log(data);
          response.send(data.data);
        }
      } catch (err) {
        next(err);
      }
    } else {
      response.send(`Missing: 
      query userId(UUID)`);
    }
  }
);

export default router;
// Get user info

const getUserOrdersQuery = (userId: string) => `query getUserOrders {
  orders(where: {user_id: {_eq:"${userId}"}}) {
    email
    address
    additional_information
    latitude
    longitude
    status
    created_at
    updated_at
    orders_products {
      id
      order_id
      product_id
      product_option_id
      unit_price
      quantity
      user_id
      created_at
      products_option{
        product{
          name
          image_url
        }
      }
    }
  }
}`;
