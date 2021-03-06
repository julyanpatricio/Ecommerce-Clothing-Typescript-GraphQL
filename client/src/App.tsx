import Home from "./components/Home/Home";
import "./App.css";
import Products from "./components/products/products";
import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
// import LoggedIn from "./components/Login/LoggedIn";
import { DetailProductCards } from "./components/Details/DetailProductCards";
import Add from "./components/Add/Add";
import PrevCart from "./components/Cart/PrevCart";
import Favorites from "./components/Perfil/Favorites/Favorites";
import EditProfile from "./components/Perfil/EditProfile/EditProfile";
// import Profile from "./components/Perfil/Profile";
import SearchedProducts from "./components/Search/SearchedProducts";
import EditUsers from "./components/Users/EditUsers";
import History from "./components/Perfil/History/History";
import EditOrders from "./components/Orders/EditOrders";
import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosResponse } from "axios";
import { cartIsLoading, setDataUser, setProductsIdsInCart } from "./actions";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import ModifyProducts from "./components/ModifyProducts/ModifyProducts";

function App() {
  const state = useSelector((state: RootState) => state);

  type User = {
    id: string;
    email: string;
    auth0_id: string;
  };

  interface RootState {
    user: User;
  }

  const { user, isAuthenticated } = useAuth0();
  const BASE_URL = process.env.REACT_APP_BASE_BACKEND_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isAuthenticated && state.user.id.length === 0) {
        // get user data
        const dataUser = await axios.post(
          `${BASE_URL}/findOrCreateUserInDatabase`,
          {
            auth0_id: user.sub,
            email: user.email,
            name: user.name,
          }
        );

        dispatch(setDataUser(dataUser.data));
        if (localStorage.cartStorage) {
          dispatch(cartIsLoading(true));
          const { data } = await axios.post(
            `${BASE_URL}/addLocalStorageToCart`,
            {
              cart: JSON.parse(localStorage.cartStorage),
              user_id: dataUser.data.id,
            }
          );
          if (data.insert_carts_products) {
            console.log("se agregaron los productos de localstorage a la db");
            localStorage.cartStorage = [];
            localStorage.idsInCartStorage = [];
          } else {
            console.log("errDataLoggedIn", data);

            console.log(
              "no se agregaron los productos de localstorage a la db"
            );
          }
          let idsInCart: AxiosResponse<any> = await axios.get(
            `${process.env.REACT_APP_BASE_REST_API_HASURA}/getProductsIdsInCart/${dataUser.data.id}`
          );

          idsInCart = idsInCart.data.carts_products.map(
            (product) => product.products_option.product_id
          );
          dispatch(setProductsIdsInCart(idsInCart));
          dispatch(cartIsLoading(false));
        }
      }
    })();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <BrowserRouter>


      <Route path="/" component={NavBar} />
      <Route exact path="/" component={Home} />
      <Route exact path="/cart" component={PrevCart} />
      <Route exact path="/profile/editprofile" component={EditProfile} />
      <Route exact path="/clothing/details/:id" component={DetailProductCards}/>
      <Route exact path="/search" component={SearchedProducts} />
      <Route exact path="/clothing/:gender" component={Products} />
      <Route exact path="/profile/favorites" component={Favorites} />
      <Route exact path="/profile/shopping-history" component={History} />


      <Route exact path="/admin/createproduct">
        <PrivateRoute component={Add} />
      </Route>
      <Route exact path="/admin/editusers">
        <PrivateRoute component={EditUsers} />
      </Route>
      <Route exact path="/admin/editorders">
        <PrivateRoute component={EditOrders} />
      </Route>
      <Route exact path="/admin/modifyproducts">
        <PrivateRoute component={ModifyProducts} />
      </Route>


    </BrowserRouter>
  );
}

export default App;
