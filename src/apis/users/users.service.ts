import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import coolsms from 'coolsms-node-sdk';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto) {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new ConflictException('이미 가입한 email입니다.');
    }
    await this.userRepository.save(createUserDto);

    return {
      status: {
        code: 200,
        message: '회원가입 성공!',
      },
    };
  }

  async findOne({ email }) {
    return await this.userRepository.findOneBy({ email });
  }

  async findId({ name, phone }) {
    const user = await this.userRepository.findOne({
      where: { name, phone },
    });
    if (!user) {
      throw new UnprocessableEntityException('없는 유저 입니다.');
    }
    return user.email;
  }

  async findUserPWd({ name, phone, email }) {
    // 임시 비밀번호 발급
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialCharacters = '!@#$%^&*(),.?:{}|<>';
    const numbers = '0123456789';

    // 비밀번호 길이 6자리로 지정
    const passwordLength = 6;
    let temPassword = '';

    // passwordLength에서 2를 뺀 갯수만큼 영어로 채워줌
    while (temPassword.length < passwordLength - 2) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      temPassword += characters.charAt(randomIndex);
    }

    // 렌덤한 특수문자 한 개 가져오기
    const randomSpecialChar = specialCharacters.charAt(
      Math.floor(Math.random() * specialCharacters.length),
    );
    // 랜덤한 숫자 한 개 가져오기
    const randomNumber = numbers.charAt(
      Math.floor(Math.random() * numbers.length),
    );
    // 가져온 랜덤한 특수문자를 임시비밀번호에 추가
    temPassword += randomSpecialChar;
    // 가져온 랜덤한 숫자를 임시비밀번호에 추가
    temPassword += randomNumber;

    const user = await this.userRepository.findOne({
      where: { name, phone, email },
    });
    if (!user) {
      throw new UnprocessableEntityException('가입되지 않은 회원입니다.');
    }
    const hashedPassword = await bcrypt.hash(temPassword, 10);

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    const messageService = new coolsms(
      process.env.COOLSMS_API_KEY,
      process.env.COOLSMS_API_SECRET,
    );

    messageService
      .sendOne({
        to: `${phone}`,
        from: process.env.COOLSMS_PHONE,
        text: `[PriceCrush] 임시비밀번호 : ${temPassword}`,
        type: 'SMS',
        autoTypeDetect: false,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.error(err));

    return { status: { code: 200, msg: `${temPassword} 문자발송 완료!` } };
  }

  async updatePwd({ password, email }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const changedPwd = (
      await this.userRepository.update(
        {
          email,
        },
        { password: hashedPassword },
      )
    ).affected
      ? true
      : false;
    if (!changedPwd) {
      throw new ConflictException(
        '비밀번호 변경이 정상적으로 이루어지지 않았습니다.',
      );
    } else {
      return {
        status: {
          code: 200,
          msg: '비밀번호가 정상적으로 변경되었습니다.',
        },
      };
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
