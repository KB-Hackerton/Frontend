import api from '@/api/index.js'

const BASE_URL = '/chat'

export default {
  async getChatRoomList()
  {
    const res = await api.get(BASE_URL + "/my/rooms",
      {
        Authorization : `Bearer ${localStorage.getItem("accessToken")}`
      })
    console.log(res)
    return res
  },
}
