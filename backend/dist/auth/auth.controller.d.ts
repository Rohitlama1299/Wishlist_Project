import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: Partial<import("../entities").User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<import("../entities").User>;
    }>;
    getProfile(req: any): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        profilePicture: any;
        createdAt: any;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<Partial<import("../entities").User>>;
}
