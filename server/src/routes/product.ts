import axios from "axios";

import {Response, Request, Router, NextFunction} from 'express';
const router = Router()


router.get("/", async (req: Request, response: Response, next: NextFunction) => {
  const id = req.query.id
  console.log(id)
  try {
    const {data} = await axios({
      url: "https://henry-pg-api.herokuapp.com/v1/graphql",
      method: "POST",
      data: { query:
        `query product {
          products ( where: {id: {_eq: $id }}) {
            price
            name
            product_options(where: {product_id: {_eq: $id }}) {
              color
              image_url
              size
              stock
            }
          }`
        },
    });
    await console.log(data)
    response.status(200).json(data.data)
  } catch (err) {
    next(err)
  }
});

export default router;
