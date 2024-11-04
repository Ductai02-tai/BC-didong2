import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.20.10.8:8080/api/auth/";

interface UserResponse {
  accessToken: string;
  username: string; // Phải có thuộc tính này
  [key: string]: any; // thêm các thuộc tính khác nếu cần
}

class AuthService {
  async login(username: string, password: string): Promise<UserResponse> {
    try {
      const response = await axios.post<UserResponse>(API_URL + "signin", { username, password });
      if (response.data.accessToken) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to remove user data from storage", error);
    }
  }

  register(username: string, email: string, password: string): Promise<any> {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }
 
  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      const user = await AsyncStorage.getItem("user");
      return user ? JSON.parse(user) as UserResponse : null;
    } catch (error) {
      console.error("Failed to retrieve user data from storage", error);
      return null;
    }
  }
  //
  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Người dùng chưa đăng nhập");

    const response = await axios.post(API_URL + "change-password", {
      currentPassword,
      newPassword,
    }, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    return response.data;
  }
  //
   // Phương thức yêu cầu gửi mã OTP đến email
   async requestOtp(email: string): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}request-otp`, { email });
    return response.data; // Đảm bảo trả về dữ liệu từ phản hồi
  }

  // Phương thức xác thực mã OTP
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}verify-otp`, { email, otp });
    return response.data;
  }

  // Phương thức đặt lại mật khẩu
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}reset-password`, { email, otp, newPassword });
    return response.data;
  }

  
}
export default new AuthService();
