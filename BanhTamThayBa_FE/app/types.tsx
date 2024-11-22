import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
 

export type CartItem = {
    id: number;
    name: string;
    price: string;
    quantity: number;
    image: string;
};
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

// Định nghĩa kiểu navigation prop cho ForgotPasswordScreen
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPasswordScreen'>;

 

 
export type ResetPasswordScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'ResetPassword'>,
  StackNavigationProp<RootStackParamList>
>;

 
export type ResetPasswordScreenProps = {
    route: ResetPasswordScreenRouteProp;
    navigation: StackNavigationProp<any>;  
  };
// Định nghĩa kiểu cho các tham số của VerifyOtpScreen
export type VerifyOtpScreenRouteProp = RouteProp<RootStackParamList, 'VerifyOtpScreen'>;

// Định nghĩa kiểu navigation prop cho VerifyOtpScreen
export type VerifyOtpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyOtpScreen'>;

 
export type VerifyOtpScreenProps = {
  route: VerifyOtpScreenRouteProp;
  navigation: VerifyOtpScreenNavigationProp;
};
