import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    validateUser(userId: string): Promise<User | null>;
    updateProfile(userId: string, updateData: {
        firstName?: string;
        lastName?: string;
        profilePicture?: string;
    }): Promise<Partial<User>>;
}
