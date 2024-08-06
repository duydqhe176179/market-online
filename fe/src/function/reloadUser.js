import axios from "axios"

const reloadUser = async (idUser) => {
    try {
        const response = await axios.post(`http://localhost:8080/reloadUser?idUser=${idUser}`)
        localStorage.setItem("user",JSON.stringify(response.data))
        return response.data
    } catch (error) {
        console.log(error);
    }
    return null
}
export default reloadUser