export interface CaptchaData {
  Ip: string;
  math_problem: string;
  answer: number;
  isVerified?: boolean;
  createdAt: Date;
  expireIn: Date;
}
