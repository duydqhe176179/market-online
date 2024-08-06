import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";



const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        checkedItem: [],
        totalPrice: 0
    },
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload
            const { idProduct } = newItem

            const existItem = state.items.find(
                (item) => item.idProduct === idProduct
            )

            if (existItem) {
                state.items = state.items.map((item) => {
                    if (item.idProduct === idProduct) {
                        return {
                            ...item,
                            quantity: item.quantity + newItem.quantity,
                            totalPrice: item.totalPrice + newItem.price * newItem.quantity
                        }
                    }
                    return item
                })
            } else {
                state.items.push({
                    idProduct: newItem.idProduct,
                    category: newItem.category,
                    description: newItem.description,
                    image: newItem.image,
                    material: newItem.material,
                    name: newItem.name,
                    numberOfSale: newItem.numberOfSale,
                    price: newItem.price,
                    quantity: newItem.quantity,
                    remain: newItem.remain,
                    sale: newItem.sale,
                    shop: newItem.shop
                })
                const userID = JSON.parse(localStorage.getItem("user")).id
                const dataSaveToDB = {
                    idUser: userID,
                    idProduct: newItem.idProduct,
                    quantity: newItem.quantity
                }

                fetch("http://localhost:8080/saveCart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataSaveToDB)
                }).then(response => response.json())
                    .then(data => {
                        console.log(data)
                        setTimeout(message.success("Sản phẩm đã được thêm vào giỏ hàng."), 2000)
                    })
                    .catch(error => console.error('Error:', error));
            }
        },
        takePayment(state, action) {
            
        }
    }
})

export const {
    addItemToCart,
    takePayment
} = cartSlice.actions
export default cartSlice.reducer