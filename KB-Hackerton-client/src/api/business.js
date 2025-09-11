import axios from 'axios'

const API_URL = 'https://api.odcloud.kr/api/nts-businessman/v1/validate'
const SERVICE_KEY = import.meta.env.VITE_VUE_APP_SERVICE_KEY

export default {
  async postBusinessValidate(businessData) {
    const res = await axios.post(
      `${API_URL}?serviceKey=${SERVICE_KEY}`,
      { businesses: [businessData] },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    )
    return res.data
  },
}
