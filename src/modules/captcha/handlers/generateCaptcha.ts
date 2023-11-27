import { generateRandomMathProblem } from 'src/utils';
import { CaptchaData } from '../interfaces';
import { captchaExpireDate } from 'src/configs';
import { captchaMap } from '../captcha.controller';
import { Response } from 'express';

export async function generateCaptchaHandler(Ip: string, res: Response) {
  /**
   *
   * @generate_math_problem
   * generating math problem for user checking
   *
   */
  let { answer, math_problem } = generateRandomMathProblem();

  /**
   *
   * @prepare_data_to_map
   * prepare data for setting to map
   *
   */
  let captchaData: CaptchaData = {
    Ip,
    answer: answer,
    math_problem: math_problem,
    isVerified: false,
    createdAt: new Date(),
    expireIn: new Date(new Date().getTime() + captchaExpireDate),
  };

  /**
   * @delete_old_data
   * @set_new_data
   * here, we have to set captcha info to map
   */
  captchaMap.delete('captcha');
  captchaMap.set('captcha', captchaData);

  /**
   *
   * @response
   * sending final response
   *
   */
  res.json({
    message: 'here is your math problem for captcha ',
    math_problem: math_problem,
    Ip,
  });
}
