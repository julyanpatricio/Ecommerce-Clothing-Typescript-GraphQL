import axios, { AxiosResponse } from "axios";
import { Response, Request, Router, NextFunction } from "express";
const router = Router();
require("dotenv").config();

router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    const { user_id } = request.query;
    const user_id_query: string = (user_id as string) ?? "";
    if (user_id_query !== "") {
      try {
        const { data }: AxiosResponse<CartDataFromHasura> = await axios({
          url: "https://henry-pg-api.herokuapp.com/v1/graphql",
          method: "POST",
          data: {
            query: getUserCartDataQuery(user_id_query),
          },
        });

        if (data.errors) {
          response.send(data.errors);
        } else {
          console.log(data);
          const orderedData = orderArray(data);
          response.send(orderedData);
        }
      } catch (err) {
        next(err);
      }
    } else {
      response.send(`Missing: 
      query user_id(UUID)`);
    }
  }
);

export default router;

const getUserCartDataQuery = (user_id: string) => `query {
    users_by_pk(id: "${user_id}") {
      cart_products {
        products_option {
          id
          size
          color
          image_url
          product {
            id
            name
            price
            image_url
          }
        }
      }
    }
  }
  `;

const orderArray = (hasuraData: CartDataFromHasura) => {
  const productData = hasuraData.data.users_by_pk.cart_products;
  console.log("acaorder", productData);
  let newData = productData.map((productOption: CartProducts) => {
    let option: Products_Option = productOption.products_option;
    console.log("acá option", option);
    return {
      baseId: option.product.id,
      baseName: option.product.name,
      basePrice: option.product.price,
      baseImage: option.product.image_url,
      productOption: {
        optionId: option.id,
        optionSize: option.size,
        optionColor: option.color,
        optionImage: option.image_url,
      },
    };
  });

  return newData;
};

type CartDataFromHasura = {
  data: {
    users_by_pk: {
      cart_products: CartProducts[];
    };
  };
  errors: any;
};

type CartProducts = {
  products_option: Products_Option;
};

type Products_Option = {
  id: string;
  size: string;
  color: string;
  image_url: string;
  product: Product;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};
