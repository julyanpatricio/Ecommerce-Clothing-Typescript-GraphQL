// import React from "react";
import "./DetailProductCard.css";
// import { useCookies } from 'react-cookie';
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from "react";
import axios from "axios";
// import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import { addToCartStorage } from "../../actions";

type Product = {
    id_option: string
}

interface RootState {
    cart: Array<Product>,
    idsInCart: string
}


export const DetailsProductCard = ({
    id,
    name,
    image_url,
    price,
    id_option,
    color,
    size,
    stock

}) => {

    const dispatch = useDispatch()
    const state = useSelector((state: RootState) => state)

    const [productDetail, setProductDetail] = useState({
        id,
        name,
        image_url,
        price,
        id_option,
        color,
        size,
        stock,
        quantity: 1,
    })

    useEffect(() => {
        setProductDetail({
            id,
            name,
            image_url,
            price,
            id_option,
            color,
            size,
            stock,
            quantity: 1,
        })
        return () => {
            //limpiar el componente

        }
        // eslint-disable-next-line 
    }, [id_option])


    const { user, isAuthenticated } = useAuth0()
    const BASE_URL = process.env.REACT_APP_BASE_BACKEND_URL;
    console.log('user auth0', user); //temporal para evitar error eslint


    async function addToCart(id: string) { //el id del producto
        if (!isAuthenticated) {
            const existProductInCartRedux = state.cart.some(product => product.id_option === id_option)
            if (existProductInCartRedux) alert('El proudcto ya existe en el carrito')
            else dispatch(addToCartStorage(productDetail))

        } else {
            let validId = await axios.get(`${BASE_URL}/verifyUserAuth0InDatabase?id_auth0=${user.sub}`)
            if (!validId.data.user_id) {
                validId = await axios.post(`${BASE_URL}/addUserToDatabase`, {
                    auth0_id: user.sub,
                    email: user.email,
                    name: user.name
                })
            }

            const dataAddToCart = await axios.post(`${BASE_URL}/addToCart`, {
                user_id: validId.data.user_id,
                product_option_id: id_option,
                quantity: 1
            });

            if (!dataAddToCart.data.errors) alert('producto agregado al carrito') //recordatorio: agregar una tilde verde al lado del boton "agregar al carrito"
            else alert(dataAddToCart.data.errors)

        }

    }




    return (
        <div className="mainDetailCard" >
            <div className="mainDetailCard__container">
                <div className="container__img">
                    <img src={image_url} width='100%' alt="" className="container__card-img" />
                </div>
                <div className="container__card-content">
                    <div className='div_name_product_details'>
                        <h1>{name}</h1>

                    </div>
                    <div className='div_price_product_details'>
                        <span className='price_product_details'> ${price}</span>
                    </div>
                    <div className='div_color_product_details'>
                        <span>{color}</span>
                    </div>
                    <div className='div_size_product_details'>
                        <span>{size}</span>
                    </div>
                    <div className='div_stock_product_details'>
                        <span>Stock:</span><span> disponible </span>
                    </div>
                    <div className="container__button-buy">
                        <button onClick={e => addToCart(id)}>Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>
    )
}