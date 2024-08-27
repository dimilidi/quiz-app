import axios from "axios"

export const api = axios.create({
	baseURL: "http://localhost:8080/subjects"
})


export const getSubjects = async() =>{
    try {
      const response = await api.get("/get")
      return response.data
    } catch (error) {
      console.error(error)
  
    }
  }